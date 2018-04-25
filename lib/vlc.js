const EventEmitter = require('events').EventEmitter
const request = require('request')
const { appendQueryString } = require('./utils')

const COMMANDS = ['pl_pause', 'seek']

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

function sendCommand(address, command, options, callback) {
  if (!COMMANDS.includes(command)) {
    return callback(new Error('Invalid Command'))
  }

  let dest = appendQueryString(address, { command })

  if (typeof options === 'function') {
    callback = options
  } else if (typeof options === 'object') {
    dest = appendQueryString(dest, options)
  }

  return send(dest, callback)
}

module.exports = function(options) {
  const opt = Object.assign({
    host: 'localhost',
    port: 8080,
    password: 'pass',
    pollInterval: 250
  }, options)

  let timerId
  const address = `http://:${opt.password}@${opt.host}:${opt.port}/requests/status.json`
  
  return {
    sendCommand,
    togglePlay(callback) {
      return sendCommand(address, 'pl_pause', callback)
    },
    getStat(callback) {
      return send(address, callback)
    },
    seek(time, callback) {
      sendCommand(address, 'seek', { val: time }, callback)
    },
    startPoll() {
      const event = new EventEmitter()
      let state;

      timerId = setInterval(() => {
        return send(address, (err, stat) => {
          if (state !== stat.state) {
            state = stat.state
            event.emit('STATE_CHANGED', state)
          }
        })
      }, opt.pollInterval)

      return event
    },
    stopPoll() {
      clearInterval(timerId)
    }
  }
}
