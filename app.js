const express = require('express');
const app = express();
const Database = require('./database/db');

const port = process.env.PORT || 3000;

Database.saveToDatabase();

Database.connect().then(() =>
  app.listen(port, () => console.log(`Server running on ${port}`))
);
