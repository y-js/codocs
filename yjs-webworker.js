
var url = location.host === 'localhost:8080' ? 'localhost:1234' : 'https://codocs.dmonad.io'

// Define global variables
DBConfig = {
  name: 'indexeddb'
}
ConnectorConfig = {
  name: 'websockets-client',
  url: url,
  options: {
    jsonp: false
  },
  generateUserId: true
}

importScripts(
  '/bower_components/yjs/y.js',
  '/bower_components/y-memory/y-memory.js',
  '/bower_components/y-indexeddb/y-indexeddb.js',
  '/bower_components/y-websockets-client/y-websockets-client.js',
  '/bower_components/y-webworker/yjs-webworker-service.js'
)
