/* eslint-env worker */

importScripts(
  '/bower_components/yjs/y.js',
  '/bower_components/y-array/y-array.js',
  '/bower_components/y-map/y-map.js',
  '/bower_components/y-memory/y-memory.js',
  '/bower_components/y-indexeddb/y-indexeddb.js',
  '/bower_components/y-websockets-client/y-websockets-client.js'
)
if (typeof debug != 'undefined') {
  Y.debug.enable(debug)
}

var debug = Y.debug('codocs:service-worker')

var url = location.host === 'localhost:8080' ? 'localhost:1234' : 'https://codocs.dmonad.io'
var socket = Y['websockets-client'].io(url, { jsonp: false })

self.connectorConfig = {
  name: 'websockets-client',
  socket: socket
}

// When the 'overview' room is loaded, we preload every document one after another.
var docs
function findNextSyncTarget () {
  if (docs != null) {
    for (var i = 0; i < docs.length; i++) {
      var roomId = docs.get(i).get('roomId')
      var roomName = btoa(JSON.stringify({
        type: 'room',
        roomId: roomId
      }))
      if (instances[roomName] == null) {
        // preload this room
        var instance = createYjsInstance(roomName, docs.get(i).get('secret'))
        instances[roomName] = instance
        instance.then(function () {
          debug('Finished preloading room "%s"', roomName)
          findNextSyncTarget()
        })
        debug('Preloading room "%s"', roomName)
        break
      }
    }
  }
}

self.createYjsInstance = function (room, auth) {
  var types = {}
  var isOverview = JSON.parse(atob(room)).type === 'overview'

  if (isOverview) {
    types = { docs: 'Array' }
  }
  var instance = Y({
    // yjs-sw-include creates connector-proxy based on connectorConfig
    connector: {
      name: 'connector-proxy',
      room: room,
      auth: auth
    },
    db: {
      name: 'indexeddb'
    },
    share: types
  })
  if (isOverview) {
    instance.then(function (y) {
      docs = y.share.docs
      findNextSyncTarget()
    })
  }
  return instance
}

importScripts(
  '/bower_components/y-serviceworker/yjs-sw-include.js'
)
