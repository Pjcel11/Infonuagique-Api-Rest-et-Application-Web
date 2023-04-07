// Packages & files
const { Sequelize, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt'); // For login
const employeesModel = require('../models/employees');
const jobsModel = require('../models/jobs');
const salaryGridModel = require ('../models/salarygrid');
const { salariesTemplate, employeesTemplate, jobsTemplate } = require('./template');

// Database connection infos
let sequelize;
sequelize = new Sequelize('api-salary', 'root', '', {
	host: 'localhost',
	dialect: 'mariadb',
	dialectOptions: {
		timezone: 'local',
	},
	logging: false
});

// Table models
const employees = employeesModel(sequelize, DataTypes);
const jobs = jobsModel(sequelize, DataTypes);
const salaryGrid = salaryGridModel(sequelize, DataTypes);

// Initialize database function
const initDb = () => {
	return sequelize.sync({force: true}).then(_ => {
		// Create and fill salarygrid table
		salariesTemplate.map(salary => {
			salaryGrid.create({
				jobId: salary.jobId,
				level: salary.level,
				increasedIndex: salary.increasedIndex,
				durationMonths: salary.durationMonths
			});
		})

		// Create and fill employees table
		employeesTemplate.map(employee => {
			employees.create({
				firstName: employee.firstName,
				lastName: employee.lastName,
				email: employee.email,
				jobId: employee.jobId,
				seniority: employee.seniority,
				level: employee.level
			});
		})

		// Create and fill jobs table
		jobsTemplate.map(job => {
			jobs.create({
				id: job.id,
				label: job.label
			});
		})

		// Done
		console.log('Databases filled.');
	})
};

// Exmport the init function 
module.exports = { 
	initDb, employees, jobs, salaryGrid, sequelize
};