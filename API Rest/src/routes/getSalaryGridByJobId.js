const {salaryGrid} = require('../db/sequelize');
const {Op} = require('sequelize');

module.exports = (app) => {
	app.get('/salaryGrid/:jobid',(req, res) => {
		salaryGrid.findAll({
			where: {
				jobId: {[Op.eq]: req.params.jobid}
			},
			order: [['level', 'ASC']]
		})
		.then(e => {
			const message = 'Salary grid fetched successfully.'
			res.status(200).json({status:200, message, data: e })
		})
		.catch(error => {
			const message = `Salary grid could not be fetched. Please retry.`
			res.status(500).json({status:500, message, data: error })
		})
	})
}