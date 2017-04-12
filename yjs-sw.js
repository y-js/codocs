/* eslint-env worker */

importScripts(
  '/bower_components/yjs/y.js',
  '/bower_components/y-memory/y-memory.js',
  '/bower_components/y-indexeddb/y-indexeddb.js',
  '/bower_components/y-websockets-client/y-websockets-client.js'
)

var url = location.host === 'localhost:8080' ? 'localhost:1234' : 'https://codocs.dmonad.io'

// copy and modify this file

self.DBConfig = {
  name: 'indexeddb'
}
self.ConnectorConfig = {
  name: 'websockets-client',
  socket: Y['websockets-client'].io(url, { jsonp: false })
}

importScripts(
  '/bower_components/y-serviceworker/yjs-sw-include.js'
)
