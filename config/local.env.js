'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"local"',
  DEBUG_MODE: true,
  API_BASE_URL: "'http://localhost:8000/'"
})
