const { employees } = require ('../db/sequelize')
const { Op } = require('sequelize')

module.exports = (app) => {
    app.get('/employees',(req, res) => {
      
        employees.findAll({ order: ['id'] })
        .then(e => {
          const message = 'La liste des employes a bien été récupéré.'
          res.status(200).json({status:200, message, data: e })
        })
        .catch(error => {
          const message = `La liste des employes n'a pas pu être récupéré. 
                           Réessayez dans quelques instants.`
          res.status(500).json({status:500, message, data: error })
        })
      
    })
  }