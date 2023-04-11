const { salaryGrid, sequelize } = require('../db/sequelize');
const { Op } = require('sequelize');

module.exports = (app) => {
	app.get('/salarygrid/:id/:months/:level',(req, res) => {

		salaryGrid.findAll({ 
			attributes: [[sequelize.fn('MIN', sequelize.col('durationMonths')), 'minDuration']], 
			where: {
				jobId: req.params.id,
				durationMonths: {
					[Op.gt]: req.params.months
				}
			},
			order: [['level', 'ASC']],
			raw: true
		})
		.then(e => {
			const minDuration = e[0].minDuration;

			salaryGrid.findAll({ 
				attributes: [[sequelize.fn('COUNT', sequelize.col('durationMonths')), 'levelCount']], 
				where: {
					durationMonths: minDuration
				},
				raw: true
			})
			.then(f => {
				const levelCount = f[0].levelCount;

				if (levelCount > 1) {
					salaryGrid.findAll( {
						attributes: ['id', 'level', 'increasedIndex', 'durationMonths', 'grossSalary'], 
						where: {
							durationMonths: minDuration,
							level: req.params.level
						}
					})
					.then(g => {
						  const message = 'Salary fetched successfully.'
						 res.status(200).json({status:200, message, data: g})
					})
					.catch(error => {
						 const message = `Salary could not be fetched. Please retry.`
						  res.status(500).json({status:500, message, data: error })
					});
				}
				else {
					salaryGrid.findAll( {
						attributes: ['id', 'level', 'increasedIndex', 'durationMonths', 'grossSalary'], 
						where: {
							durationMonths: minDuration,
						}
					})
					.then(g => {
						  const message = 'Salary fetched successfully.'
						 res.status(200).json({status:200, message, data: g})
					})
					.catch(error => {
						 const message = `Salary could not be fetched. Please retry.`
						  res.status(500).json({status:500, message, data: error })
					});
				}
			})
			.catch(error => {
				const message = `Salary count could not be fetched. Please retry.`
				res.status(500).json({status:500, message, data: error })
			});
		})
		.catch(error => {
			const message = `Minimum salary could not be fetched. Please retry.`
			res.status(500).json({status:500, message, data: error })
		});  
	})
}