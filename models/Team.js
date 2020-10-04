const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  teamId: {
    type: Number,
  },
  logoUrl: {
    type: String,
  },
});

teamSchema.set('timestamps', true);
const Team = mongoose.model('Team', teamSchema);

module.exports = {
  Team,
};
