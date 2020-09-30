const mongoose = require('mongoose');
const axios = require('axios');
var { Stat } = require('../models/Stats');
const { Team } = require('../models/Team');
require('dotenv').config();

async function connect() {
  const conn = await mongoose.connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  });
  console.log(`Connected to ${conn.connection.host}`);
}

async function disconnect() {
  console.log(`DB is now seeded with data`);
  await mongoose.connection.close();
}

async function clearDatabase() {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
}

async function getStatApiData() {
  await clearDatabase();
  const url = `https://api.eliteprospects.com/v1/team-stats?limit=160&sort=-season,position&league=shl&apiKey=${process.env.API_KEY}`;
  const response = await axios.get(url);
  await saveTeamStatToDatabase(response.data.data);
}

async function getTeamApiData() {
  const url = `https://api.eliteprospects.com/v1/teams?limit=100&sort=name&league=shl&apiKey=${process.env.API_KEY}`;
  const response = await axios.get(url);
  await saveTeamToDatabase(response.data.data);
}

async function saveTeamToDatabase(data) {
  console.log('Team');
  let idArray = [];
  Object.keys(data).forEach(function (key) {
    idArray.push(data[key].id);
  });
  for (const id of idArray) {
    let url = `https://api.eliteprospects.com/v1/teams/${id}?apiKey=${process.env.API_KEY}`;
    const response = await axios.get(url);
    let teams = new Team({
      name: response.data.data.name,
      id: response.data.data.id,
      logoUrl: response.data.data.logoUrl,
    });
    await teams.save();
  }
}

async function saveTeamStatToDatabase(data) {
  console.log('TeamStat');
  let array = [];
  Object.keys(data).forEach(function (key) {
    array.push(data[key]);
  });

  for (const data of array) {
    const stats = new Stat({
      season: {
        slug: data.season.slug,
        startYear: data.season.startYear,
        endYear: data.season.endYear,
      },
      name: data.teamName,
      leagueName: data.leagueName,
      position: data.position,
      stats: {
        GP: data.stats.GP,
        W: data.stats.W,
        L: data.stats.L,
        T: data.stats.T,
        OTW: data.stats.OTW,
        OTL: data.stats.OTL,
        PTS: data.stats.PTS,
        GF: data.stats.GF,
        GA: data.stats.GA,
        GD: data.stats.GD,
      },
    });
    await stats.save();
  }
}
async function saveToDatabase() {
  await getStatApiData();
  await getTeamApiData();
  await disconnect();
}

module.exports = {
  connect,
  disconnect,
  clearDatabase,
  saveToDatabase,
};
