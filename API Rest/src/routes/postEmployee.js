const { ValidationError, UniqueConstraintError } = require('sequelize')
const { employees } = require('../db/sequelize')


module.exports = (app) => {
	app.post('/employees', (req, res) => { 
		employees.create(req.body)
			.then(emp => {
				const message = `Employee '${req.body.firstName} ${req.body.lastName}' was created successfully.`
				res.status(200).json({ status: 200,message, data: emp })
			})
			.catch( error => {
				if(error instanceof ValidationError) {
					return res.status(400).json({status:400, message: error.message, data: error})
				}
				if (error instanceof UniqueConstraintError){
					return res.status(400).json({status:400, message: error.message, data: error})
				}
				const message= `Employee list could not be fetched. Please retry.`
				res.status(500).json({message, data:error})
		})
	})
}