const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Database = require('./database/db');
const router = require('./routes/router');
var cors = require('cors');

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

const port = process.env.PORT || 3000;

Database.saveToDatabase();

Database.connect().then(() =>
  app.listen(port, () => console.log(`Server running on ${port}`))
);
