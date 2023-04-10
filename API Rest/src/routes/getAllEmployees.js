const { employees, jobs } = require ('../db/sequelize');

module.exports = (app) => {
    app.get('/employees',(req, res) => {
        employees.findAll({ order: ['id'], include: jobs }) // Order results by ID
        .then(e => {
          	const message = 'Employee list fetched successfully'
         	res.status(200).json({status:200, message, data: e })
        })
        .catch(error => {
         	const message = `Employee list could not be fetched. Please retry.`
          	res.status(500).json({status:500, message, data: error })
        });
    })
}