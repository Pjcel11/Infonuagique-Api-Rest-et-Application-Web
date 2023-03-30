// TODO : Init Sequelize

const { Sequelize, DataTypes } = require('sequelize')
//const PokemonModel = require('../models/pokemon')
//const UserModel = require('../models/user') //on importe le modele
//const pokemons = require('./mock-pokemon')
//const bcrypt = require('bcrypt') // pour crypter des trucs si on fait le login
const EmployeesModel= require('../models/employees')
const JobsModel= require('../models/jobs')
const SalaryGridModel=require ('../models/salarygrid')

let sequelize 
/* on init sequelize et on le paramètre juste en dessous selon que 
Selon qu'on est en mode prod ou en mode Dev
*/


/* // Cette partie du code servira si on utilise un hébergeur pour lier à MariaDb
if(process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize('bgmtfju5p8qojk1q', 't08pq19sl8lowv9d', 'fptu0v27o9bahukl', {
    host: 'eporqep6b4b8ql12.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: true
  })
} else {
  sequelize = new Sequelize('pokedex', 'username', 'password', {
    host: '192.168.64.2',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: true
  })
}
*/ // Cette partie sert en mode developpement, sur la BDD locale.

//Cette partie sert à importer les modèles qui serviront pour notre part employés et grilles salariales
//éventuellement les Users
/* // Conservés pour le moment pour la syntaxe
const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes) // on l'instancie
*/

const Employees = EmployeesModel(sequelize,DataTypes)
const Jobs = JobsModel(sequelize, DataTypes)
const Salary= SalaryGridModel(sequelize,DataTypes)

//on fait la liaison entre les modèles et la base de donnée
// on initie la Base de Donnée au démarrage (peut etre modifier le code pour ne pas forcément le faire en production)

/*
const initDb = () => {
  return sequelize.sync().then(_ => {
    console.log('INIT DB')
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types
      }).then(pokemon => console.log(pokemon.toJSON()))
    })
    
    bcrypt.hash('pikachu',10) 
    .then(hash => User.create({ username: 'pikachu', password: hash }))
    .then(user => console.log(user.toJSON()))

    console.log('La base de donnée a bien été initialisée !')
  })
}
  
module.exports = { 
  initDb, Pokemon,User
}
//on exporte tout ca

*/