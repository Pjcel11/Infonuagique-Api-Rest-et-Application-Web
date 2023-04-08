const {employees } = require('../db/sequelize')

  
module.exports = (app) => {
    app.delete('/employees/:id', (req, res) => {
        employees.findByPk(req.params.id)
        .then(employeToDelete => {
            if (employeToDelete === null) {
                const message = 'L\'employé demandé n\'existe pas. Réessayez avec un autre id.'
                return res.status(404).json({status:404, message})
            }
      
            const employeDeleted = employeToDelete;
            return employees.destroy({
                where: { id: employeToDelete.id }
            })
            .then(_ => {
                const message = `L\'employé avec l'identifiant n°${employeDeleted.id}, ${employeDeleted.firstName} ${employeDeleted.lastName}  a bien été supprimé.`
                res.json({status:200, message, data: employeDeleted })
            })
        })
        .catch( error => {
            const message= 'Le pokémon n\'a pas pu être supprimé. Réessayez dans quelques instants.'
            res.status(500).json({status:500,message, data:error})
        })
    })
}