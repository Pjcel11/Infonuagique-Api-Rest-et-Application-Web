const { salaryGrid } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')


module.exports = (app) => {
	app.put('/salaryGrid/:id', (req, res) => {
		const id = req.params.id
		salaryGrid.update(req.body, {
			where: { id: id }
		})
		.then(_ => {
			return salaryGrid.findByPk(id).then(e => {
				if (e === null) {
					const message = `Salary grid id #${req.params.id} doesn't exist. Please retry`
					return res.status(404).json({status: 404, message})
				}
				const message = `Salary grid id #${e.id} (${e.jobId} ${e.level} ${e.increasedIndex} ${e.durationMonths} ${e.grossSalary}) was successfully modified.`
				res.status(200).json({status: 200, mess: message, data: e })
			})
		})
		.catch( error => {
			if(error instanceof ValidationError) {
				return res.status(400).json({status: 400, message: error.message, data: error})
			}
			if (error instanceof UniqueConstraintError){
				return res.status(400).json({status: 400, message: error.message, data: error})
			}
			const message= 'Salary grid couldn\'t be fetched. Please retry.'
			res.status(500).json({status: 500,message, data:error})
		})
	})
}