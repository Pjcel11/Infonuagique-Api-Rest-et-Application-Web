// Packages & files
const { Sequelize, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt'); // For login
const employeesModel = require('../models/employees');
const jobsModel = require('../models/jobs');
const salaryGridModel = require ('../models/salarygrid');
const { salariesTemplate, employeesTemplate, jobsTemplate } = require('./template');

// Database connection infos
let sequelize;

if (process.env.NODE_ENV === 'production') {
	console.log("ITS PRODUCTION MODE")
	sequelize = new Sequelize('mah6htgt6hpzebtv','krhhykk6sjwoaalr','ku0pnu8cg2ea05ri',{
		host: 'q0h7yf5pynynaq54.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
		dialect: 'mariadb',
		dialectOptions: {
			logging: true
		}
	})
} else {
	console.log("ITS Devil MODE")
	sequelize = new Sequelize('api-salary', 'root', '', {
		host: 'localhost',
		dialect: 'mariadb',
		dialectOptions: {
		timezone: 'local',
	},
	logging: false
});
}

// Table models
const employees = employeesModel(sequelize, DataTypes);
const jobs = jobsModel(sequelize, DataTypes);
const salaryGrid = salaryGridModel(sequelize, DataTypes);

// FK on employee.jobId
jobs.hasOne(employees);
employees.belongsTo(jobs);

// Initialize database function
const initDb = () => {

	// Sync tables if in dev
	if (process.env.NODE_ENV !== 'production') {
		console.log("ITS Dev MODE")
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

			// Create and fill jobs table
			jobsTemplate.map(job => {
				jobs.create({
					id: job.id,
					label: job.label
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
			
			console.log('Databases filled.');
		})
		// Done
		
	} else {
		console.log("ITS PRODUCTION MODE")
		return sequelize.sync().then(_ => {
			// Create and fill salarygrid table
			salariesTemplate.map(salary => {
				salaryGrid.create({
					jobId: salary.jobId,
					level: salary.level,
					increasedIndex: salary.increasedIndex,
					durationMonths: salary.durationMonths
				});
			})

			// Create and fill jobs table
			jobsTemplate.map(job => {
				jobs.create({
					id: job.id,
					label: job.label
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
	
			//console.log('Online Databases filled.');
	})
	// Done
	}
};

// Exmport the init function 
module.exports = { 
	initDb, employees, jobs, salaryGrid, sequelize
};