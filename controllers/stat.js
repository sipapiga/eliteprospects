const statModel = require('../models/Stats');

module.exports = {
  getStatsFilterByYear: async (req, res) => {
    const { year } = req.params;
    if (year) {
      try {
        const result = await statModel.getStatsFilterByYear(year);
        res.status(200).json(result);
      } catch (err) {
        console.log(err);
        res.status(400).json('Something went wrong');
      }
    } else {
      res.status(400).json(`${year} not found`);
    }
  },
};
