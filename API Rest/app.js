// Packages & files
const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const { initDb } = require('body-parser');
const sequelize = require('./src/db/sequelize');
var cors = require('cors')

// App configuration
const app = express();
const port = 5000;

// Start app 
app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())
    .use(cors()); 

// Initialise database
sequelize.initDb();

// Endpoints
require('./src/routes/default')(app);
require('./src/routes/delEmployeById')(app);
require('./src/routes/delJobById')(app);
require('./src/routes/getAllEmployees')(app);
require('./src/routes/getAllJobs')(app);
require('./src/routes/getSalaryGridByJobId')(app);
require('./src/routes/getSalaryBySeniority')(app);
require('./src/routes/postEmployee')(app);
//require('./src/routes/postJob')(app);
require('./src/routes/putEmploye')(app);
require('./src/routes/putSalary')(app);


// Listen to port
app.listen(port, () => console.log(`App launched on http://localhost:${port}`));