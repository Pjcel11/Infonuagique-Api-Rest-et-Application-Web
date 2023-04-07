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
            const message = 'L\'employé demandé n\'existe pas. Réessayez dans quelques instants'
            return res.status(404).json({message})
        }
        const message = `L\'employé ${e.firstName} ${e.lastName}a bien été modifié.`
        res.json({message, data: e })
      })
    })
    .catch( error => {
      if(error instanceof ValidationError) {
        return res.status(400).json({message: error.message, data: error})
      }
      if (error instanceof UniqueConstraintError){
        return res.status(400).json({message: error.message, data: error})
      }
      const message= 'Le pokémon n\'a pas pu être modifié. Réessayez dans quelques instants.'
      res.status(500).json({message, data:error})
    })

  })
}