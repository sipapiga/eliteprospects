const teamModel = require('../models/Team');

module.exports = {
  getTeams: async (req, res) => {
    try {
      const result = await teamModel.getTeams();
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(400).json('Something went wrong');
    }
  },
};
