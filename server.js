#!/usr/bin/env node
/* global process, global */
'use strict'

var verifyIdToken = require('google-id-token-verifier').verify
var Y = require('../yjs/yjs/src/y.js') // TODO: require('yjs')
var minimist = require('minimist')
var atob = require('atob')
var md5 = require('js-md5')

require('y-memory')(Y)
try {
  require('y-leveldb')(Y)
} catch (err) {}

try {
  // try to require local y-websockets-server
  require('./y-websockets-server.js')(Y)
} catch (err) {
  // otherwise require global y-websockets-server
  require('y-websockets-server')(Y)
}

var options = minimist(process.argv.slice(2), {
  string: ['port', 'debug', 'db'],
  default: {
    port: process.env.PORT || '1234',
    debug: false,
    db: 'memory'
  }
})

var port = Number.parseInt(options.port, 10)
var io = require('socket.io')(port)
console.log('Running y-websockets-server on port ' + port)

// set of y instances created with type : 'room'
global.yInstances = {}
// set of y instances created with type : 'overview' (using idToken)
global.yInstancesOverview = {}

function checkAuthRoom (authInfo, y) {
  return new Promise(function (resolve, reject) {
    var roomId = JSON.parse(atob(y.connector.options.room)).roomId
    if (authInfo != null && md5(authInfo) === roomId) {
      resolve('write')
    } else {
      resolve('read')
    }
  })
}

function checkAuthOverview (authInfo, y) {
  return new Promise(function (resolve, reject) {
    verifyIdToken(authInfo, "863221146052-4h694v1mmn93991iq8vm9ub8tap3h7ve.apps.googleusercontent.com", function (err, data) {
      var roomId = JSON.parse(atob(y.connector.options.room)).roomId
      if (err == null && data.sub === roomId) {
        resolve('write')
      } else {
        reject('Unauthorized')
      }
    })
  })
}

function createYInstance (roomName) {
  var checkAuth
  try {
    var conf = JSON.parse(atob(roomName))
    if (conf.type === 'overview') {
      checkAuth = checkAuthOverview
    } else if (conf.type === 'room') {
      checkAuth = checkAuthRoom
    } else {
      return
    }
    return Y({
      db: {
        name: options.db,
        dir: 'y-leveldb-databases',
        namespace: roomName
      },
      connector: {
        name: 'websockets-server',
        room: roomName,
        io: io,
        debug: !!options.debug,
        checkAuth: checkAuth
      },
      share: {}
    })
  } catch (error) {
    return
  }
}

function getInstanceOfY (roomName) {
  if (yInstances[roomName] == null) {
    yInstances[roomName] = createYInstance(roomName)
  }
  return yInstances[roomName]
}

io.on('connection', function (socket) {
  var rooms = {} // maps room (binary encoded str) to { instance, canWrite }
  socket.on('joinRoom', function (room) {
    if (rooms[room] != null) {
      return
    }
    rooms[room] = getInstanceOfY(room).then(function (y) {
      console.log('User', socket.id, 'joins room:', room)
      y.connector.userJoined(socket.id, 'slave')
      function authListener (event) {
        if (event.action === 'userAuthenticated' && event.user === socket.id) {
          // socket is allowed to subscribe to room activity
          socket.join(y.connector.options.room)
          y.connector.removeUserEventListener(authListener)
        }
      }
      y.connector.onUserEvent(authListener)
      return y
    }, function (err) {
      console.warn(err)
    })
  })
  socket.on('yjsEvent', function (msg) {
    var p = rooms[msg.room]
    if (p != null) {
      p.then(function (y) {
        y.connector.receiveMessage(socket.id, msg)
      })
    }
  })
  socket.on('disconnect', function () {
    for (var n in rooms) {
      rooms[n].then(function (y) {
        y.connector.userLeft(socket.id)
      })
      delete rooms[n]
    }
  })
  socket.on('leaveRoom', function (room) {
    rooms[room].then(function (y) {
      y.connector.userLeft(socket.id)
    })
    delete rooms[room]
  })
})
