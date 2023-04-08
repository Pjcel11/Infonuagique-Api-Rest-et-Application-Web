const { salaryGrid } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')


module.exports = (app) => {
  app.put('/salaryGrid/:id', (req, res) => {
    const id = req.params.id
    console.log('L id du truc demande est : %id',id)
    salaryGrid.update(req.body, {
      where: { id: id }
    })
    .then(_ => {
      return salaryGrid.findByPk(id).then(e => {
        if (e === null) {
            const message = 'La grille de salaire demandée n\'existe pas. Réessayez dans quelques instants'
            return res.status(404).json({status: 404, message})
        }
        const message = `La grille de salaire ${e.jobId} ${e.level} ${e.increasedIndex} ${e.durationMonths} a bien été modifié.`
        res.json({status: 200,message, data: e })
      })
    })
    .catch( error => {
      if(error instanceof ValidationError) {
        return res.status(400).json({status: 400, message: error.message, data: error})
      }
      if (error instanceof UniqueConstraintError){
        return res.status(400).json({status: 400, message: error.message, data: error})
      }
      const message= 'La grille de salaire n\'a pas pu être modifié. Réessayez dans quelques instants.'
      res.status(500).json({status: 500,message, data:error})
    })

  })
}