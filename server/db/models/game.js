const Sequelize = require('sequelize')
const db = require('../db')

const Game = db.define('game', {
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  rounds: {
    type: Sequelize.INTEGER,
    defaultValue: 5
  }
})

module.exports = Game
