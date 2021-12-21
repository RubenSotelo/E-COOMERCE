const dotenv = require('dotenv').config();

module.exports = {

  TOKEN_SECRET: process.env.TOKEN_SECRET || '5dzA26ViZWeUhm',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  STATIC: process.env.STATIC || '../static/imagenes'

}