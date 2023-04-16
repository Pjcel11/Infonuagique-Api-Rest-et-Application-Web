const { ValidationError, UniqueConstraintError } = require('sequelize')
const { jobs } = require('../db/sequelize')


module.exports = (app) => {
	app.post('/jobs', (req, res) => { 
		jobs.create(req.body)
		.then(emp => {
			const message = `Job #${req.body.id} ${req.body.label}' was created successfully.`
			res.status(200).json({message, data: emp })
		})
		.catch( error => {
			if(error instanceof ValidationError) {
				return res.status(400).json({message: error.message, data: error})
			}
			if (error instanceof UniqueConstraintError){
				return res.status(400).json({message: error.message, data: error})
			}
			const message= `Jobs list could not be fetched. Please retry.`
			res.status(500).json({message, data:error})
		})
	})
}