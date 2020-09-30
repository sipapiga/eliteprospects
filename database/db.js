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
  saveTeamStatToDatabase(response.data.data);
}

async function getTeamApiData() {
  const url = `https://api.eliteprospects.com/v1/teams?limit=100&sort=name&league=shl&apiKey=${process.env.API_KEY}`;
  const response = await axios.get(url);
  saveTeamToDatabase(response.data.data);
}

function saveTeamToDatabase(data) {
  let idArray = [];
  Object.keys(data).forEach(function (key) {
    idArray.push(data[key].id);
  });
  for (const id of idArray) {
    let url = `https://api.eliteprospects.com/v1/teams/${id}?apiKey=${process.env.API_KEY}`;
    axios.get(url).then((response) => {
      let teams = new Team({
        name: response.data.data.name,
        id: response.data.data.id,
        logoUrl: response.data.data.logoUrl,
      });
      teams.save();
    });
  }
}

function saveTeamStatToDatabase(data) {
  console.log('TeamStat');
  Object.keys(data).forEach(function (key) {
    const stats = new Stat({
      season: {
        slug: data[key].season.slug,
        startYear: data[key].season.startYear,
        endYear: data[key].season.endYear,
      },
      name: data[key].teamName,
      leagueName: data[key].leagueName,
      position: data[key].position,
      stats: {
        GP: data[key].stats.GP,
        W: data[key].stats.W,
        L: data[key].stats.L,
        T: data[key].stats.T,
        OTW: data[key].stats.OTW,
        OTL: data[key].stats.OTL,
        PTS: data[key].stats.PTS,
        GF: data[key].stats.GF,
        GA: data[key].stats.GA,
        GD: data[key].stats.GD,
      },
    });
    stats.save();
  });
}
function saveToDatabase() {
  getStatApiData();
  getTeamApiData();
  disconnect();
}

module.exports = {
  connect,
  disconnect,
  clearDatabase,
  saveToDatabase,
};
