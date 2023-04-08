const { jobs } = require('../db/sequelize')

  
module.exports = (app) => {
    app.delete('/jobs/:id', (req, res) => {
        jobs.findByPk(req.params.id)
        .then(jobToDelete => {
            if (jobToDelete === null) {
                const message = 'Le job à supprimer n\'existe pas. Réessayez avec un autre id.'
                return res.status(404).json({status:404, message})
            }
      
            const jobDeleted = jobToDelete;
            return jobs.destroy({
                where: { id: jobToDelete.id }
            })
            .then(_ => {
                const message = `Le job avec l\'identifiant n°${jobDeleted.id}, ${jobDeleted.label} a bien été supprimé.`
                res.json({status:200, message, data: jobDeleted })
            })
        })
        .catch( error => {
            const message= 'Le job n\'a pas pu être supprimé. Réessayez dans quelques instants.'
            res.status(500).json({status:500,message, data:error})
        })
    })
}