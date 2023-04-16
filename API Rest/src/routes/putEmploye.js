const { employees } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')


module.exports = (app) => {
	app.put('/employees/:id', (req, res) => {
		const id = req.params.id
		employees.update(req.body, {
			where: { id: id }
		})
		.then(_ => {
			return employees.findByPk(id).then(e => {
				if (e === null) {
					const message = `Employee id #${req.params.id} doesn't exist. Please retry.`
					return res.status(404).json({message})
				}
				const message = `Employee id #${e.id} (${e.firstName} ${e.lastName}) was modified successfully.`
				res.status(200).json({message, data: e})
			})
		})
		.catch( error => {
			if(error instanceof ValidationError) {
				return res.status(400).json({message: error.message, data: error})
			}
			if (error instanceof UniqueConstraintError){
				return res.status(400).json({message: error.message, data: error})
			}
			const message= 'Employee list couldn\'t be fetched. Please retry.'
			res.status(500).json({message, data:error})
		})

	})
}