

DBConfig = {
  name: 'indexeddb'
}
ConnectorConfig = {
  name: 'websockets-client',
  url: 'https://codocs.dmonad.io',
  options: {
    jsonp: false
  }
}

importScripts(
  '/bower_components/yjs/y.js',
  '/bower_components/y-memory/y-memory.js',
  '/bower_components/y-indexeddb/y-indexeddb.js',
  '/bower_components/y-websockets-client/y-websockets-client.js',
  '/bower_components/y-webworker/yjs-webworker-service.js'
)
