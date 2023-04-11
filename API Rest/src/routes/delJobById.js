const { jobs } = require('../db/sequelize')

  
module.exports = (app) => {
	app.delete('/jobs/:id', (req, res) => {
		jobs.findByPk(req.params.id)
		.then(jobToDelete => {
			if (jobToDelete === null) {
				const message = `Job id #${req.params.id} doesn't exist. Please retry.`
				return res.status(404).json({status:404, message})
			}
	  
			const jobDeleted = jobToDelete;
			return jobs.destroy({
				where: { id: jobToDelete.id }
			})
			.then(_ => {
				const message = `Job id #${jobDeleted.id} (${jobDeleted.label}) was successfully deleted.`
				res.status(200).json({status:200, message, data: jobDeleted })
			})
		})
		.catch( error => {
			const message= `Job id #${req.params.id} couldn't be deleted. Please retry.`
			res.status(500).json({status:500,message, data:error})
		})
	})
}