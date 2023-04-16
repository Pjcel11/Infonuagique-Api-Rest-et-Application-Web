const { jobs } = require ('../db/sequelize');

module.exports = (app) => {
	app.get('/jobs',(req, res) => {
		jobs.findAll({ order: ['id'] }) // Order results by ID
		.then(e => {
		  	const message = 'Job list fetched successfully'
		 	res.status(200).json({message, data: e})
		})
		.catch(error => {
		 	const message = `Job list could not be fetched. Please retry.`
		  	res.status(500).json({message, data: error})
		});
	})
}