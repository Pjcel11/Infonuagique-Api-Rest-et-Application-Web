const { ValidationError, UniqueConstraintError } = require('sequelize')
const { employees } = require('../db/sequelize')


module.exports = (app) => {
  app.post('/employees',auth, (req, res) => {
    employees.create(req.body)
      .then(emp => {
        const message = `L'employé' ${req.body.firstname} ${req.body.lastname} a bien été créé.`
        res.status(200).json({ status: 200,message, data: emp })
      })
      .catch( error => {
        if(error instanceof ValidationError) {
          return res.status(400).json({status:400, message: error.message, data: error})
        }
        if (error instanceof UniqueConstraintError){
          return res.status(400).json({status:400, message: error.message, data: error})
        }
        const message= `La liste des pokémns n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({message, data:error})
    })
  })
}