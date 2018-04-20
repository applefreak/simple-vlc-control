const EventEmitter = require('events').EventEmitter
const request = require('request')
const { appendQueryString } = require('./utils')

const COMMANDS = ['pl_pause']

function send(address, callback) {
  if (typeof callback === 'undefined') {
    callback = () => {}
  }

  return request({
    method: 'get',
    url: address,
  }, (err, results, data) => {
    if (err || results.statusCode !== 200) {
      return callback(new Error('Ping Failed'))
    }

    let response
    
    try {
      response = JSON.parse(data)
    } catch(e) {
      return callback(e)
    }

    return callback(null, response)
  })
}

function sendCommand(address, command, callback) {
  if (!COMMANDS.includes(command)) {
    return callback(new Error('Invalid Command'))
  }

  const dest = appendQueryString(address, { command })

  return send(dest, callback)
}

module.exports = function(options) {
  const opt = Object.assign({
    host: 'localhost',
    port: 8080,
    password: 'pass',
    pollInterval: 500
  }, options)

  const address = `http://:${opt.password}@${opt.host}:${opt.port}/requests/status.json`
  
  return {
    sendCommand,
    togglePlay(callback) {
      return sendCommand(address, 'pl_pause', callback)
    },
    getStat(callback) {
      return send(address, callback)
    }
    // events
  }
}
