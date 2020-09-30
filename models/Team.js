const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  id: {
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
