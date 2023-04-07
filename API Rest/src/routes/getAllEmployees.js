const { employees } = require ('../db/sequelize');

module.exports = (app) => {
    app.get('/employees',(req, res) => {
        employees.findAll({ order: ['id'] }) // Order results by ID
        .then(e => {
          	const message = 'Employee list found and returned'
         	res.status(200).json({status:200, message, data: e })
        })
        .catch(error => {
         	const message = `Employee list could not be found or returned. Please retry.`
          	res.status(500).json({status:500, message, data: error })
        });
    })
}