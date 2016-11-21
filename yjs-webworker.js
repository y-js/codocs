
importScripts(
  '/bower_components/yjs/y.js',
  '/bower_components/y-memory/y-memory.js',
  '/bower_components/y-indexeddb/y-indexeddb.js',
  '/bower_components/y-websockets-client/y-websockets-client.js'
)

// Specify the connector you want to use (external connector - webworker connector first, then external connector)
const connectorName = 'websockets-client'
const ExternalConnector = Y[connectorName]
const externalConnectorOptions = {
  name: connectorName,
  url: 'localhost:1234',
  options: {
    jsonp: false
  }
}

class Serviceworker extends ExternalConnector {
  constructor (y, options) {
    var dOptions = Y.utils.copyObject(externalConnectorOptions)
    dOptions.room = options.room
    super(y, dOptions)
    this.swOptions = options
  }
  userJoined (uid, role, port) {
    super.userJoined(uid, role)
    if (port != null) {
      port.addEventListener('message', event => {
        if (event.data.room === this.swOptions.room && event.data.type === 'message') {
          this.receiveMessage(uid, event.data.message, 'serviceworker')
        }
      })
      this.connections[uid].port = port
    }
  }
  receiveMessage(uid, message, source) {
    if (message.type === 'update') {
      if (source === 'serviceworker') {
        this._broadcastDC(message)
      } else {
        this._broadcastSW(message)
      }
    }
    super.receiveMessage(uid, message, source)
  }
  send (uid, message) {
    var port = this.connections[uid].port
    if (port != null) {
      port.postMessage({
        type: 'message',
        room: this.swOptions.room,
        message: message,
        guid: uid
      })
    } else {
      super.send(uid, message)
    }
  }
  broadcast (message) {
    for (var c in this.connections) {
      this.send(uid, message)
    }
  }
  _broadcastDC (message) {
    for (var c in this.connections) {
      var port = this.connections[c].port
      if (port == null) {
        super.send(c, message)
      }
    } 
  }
  _broadcastSW (message) {
    for (var uid in this.connections) {
      var port = this.connections[uid].port
      if (port != null) {
        port.postMessage({
          type: 'message',
          room: this.swOptions.room,
          message: message,
          guid: uid
        })
      }
    }
  }
}
Y.extend('serviceworker', Serviceworker)

var instances = {}

var messageHandler = event => {
  if (event.data.room != null && event.data.type === 'join') {
    if (instances[event.data.room] == null) {
      instances[event.data.room] = Y({
        connector: {
          name: 'serviceworker',
          room: event.data.room,
          auth: event.data.auth
        },
        db: {
          name: 'indexeddb',
          namespace: 'webworker-' + event.data.room
        }
      })
    }
    instances[event.data.room].then(y => {
      event.srcElement.postMessage({
        type: 'join',
        room: event.data.room,
        guid: event.data.guid
      })
      y.connector.userJoined(event.data.guid, 'slave', event.srcElement)
      // reset auth if new auth data is supplied
      if (event.data.auth != null) {
        y.connector.resetAuth(event.data.auth)
      }
    })
  } else if (event.data.room != null && event.data.type === 'leave') {
    instances[event.data.room].then(y => {
      y.connector.userLeft(event.data.guid)
    })
  }
}

onconnect = event => {
  var port = event.ports[0]
  port.addEventListener('message', messageHandler)
  port.start()
}
