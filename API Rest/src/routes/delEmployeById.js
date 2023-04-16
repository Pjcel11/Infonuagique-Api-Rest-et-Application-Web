const {employees } = require('../db/sequelize')

  
module.exports = (app) => {
	app.delete('/employees/:id', (req, res) => {
		employees.findByPk(req.params.id)
		.then(employeToDelete => {
			if (employeToDelete === null) {
				const message = `Employee id #${req.params.id} doesn't exit. Please retry.`
				return res.status(404).json({message})
			}
	  
			const employeDeleted = employeToDelete;
			return employees.destroy({
				where: { id: employeToDelete.id }
			})
			.then(_ => {
				const message = `Employee id #${employeDeleted.id} (${employeDeleted.firstName} ${employeDeleted.lastName}) was successfully deleted.`
				res.status(200).json({message, data: employeDeleted})
			})
		})
		.catch( error => {
			const message= `Employee id #${req.params.id} could not be deleted. Please retry.`
			res.status(500).json({message, data:error})
		})
	})
}