// Packages
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { initDb } = require('body-parser');

// External files
// const sequelize = require('./src/db/sequelize');

// App configuration
const app = express();
const port = 5000;

// Start app 
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json());

// Initialise databases
// sequelize.initDb();

// Endpoints
require('./src/routes/default')(app);

// Listen to port
app.listen(port, () => console.log(`App launched on http://localhost:${port}`));