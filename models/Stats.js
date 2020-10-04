const mongoose = require('mongoose');
const statSchema = new mongoose.Schema({
  teamId: {
    type: Number,
  },
  season: {
    slug: {
      type: String,
    },
    startYear: {
      type: String,
    },
    endYear: {
      type: String,
    },
  },
  name: {
    type: String,
  },
  leagueName: {
    type: String,
  },
  position: {
    type: String,
  },
  stats: {
    GP: {
      type: Number,
    },
    W: {
      type: Number,
    },
    L: {
      type: Number,
    },
    T: {
      type: Number,
    },
    OTW: {
      type: Number,
    },
    OTL: {
      type: Number,
    },
    PTS: {
      type: Number,
    },
    GF: {
      type: Number,
    },
    GA: {
      type: Number,
    },
    GD: {
      type: Number,
    },
  },
});

statSchema.set('timestamps', true);
const Stat = mongoose.model('Stat', statSchema);

module.exports = {
  Stat,
  getStatsFilterByYear: async (year) => {
    return await Stat.aggregate([
      {
        $lookup: {
          from: 'teams',
          localField: 'teamId',
          foreignField: 'teamId',
          as: 'team',
        },
      },
      {
        $match: {
          'season.slug': year,
        },
      },
    ]).exec();
  },
};
