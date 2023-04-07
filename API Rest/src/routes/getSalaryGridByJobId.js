const {salaryGrid} = require('../db/sequelize');
const {Op} = require('sequelize');

module.exports = (app) => {
    app.get('/salaryGrid/:jobid',(req, res) => {
        salaryGrid.findAll({where: 
            {jobId: {[Op.eq]: req.params.jobid}}})
        .then(e => {
            const message = 'La grille des salaires a bien été récupéré.'
            res.status(200).json({status:200, message, data: e })
        })
        .catch(error => {
            const message = `La grille des salaires n'a pas pu être récupéré. 
                            Réessayez dans quelques instants.`
            res.status(500).json({status:500, message, data: error })
        })
    })
}