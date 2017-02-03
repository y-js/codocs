
module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/images/favicon.ico',
    '/yjs-webworker.js',
    '/manifest.json',
    '/fonts/fonts.css',
    'README.md',
    '/src/global-style.css',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.js'
  ],
  navigateFallback: '/index.html',
  runtimeCaching: [{
    urlPattern: /\/fonts\/(.*)/,
    handler: 'cacheFirst'
  }, {
    urlPattern: /\/bower_components\//,
    handler: 'cacheFirst'
  }, {
    urlPattern: /^https:\/\//,
    handler: 'cacheFirst',
    options: {
      cache: {
        maxAgeSeconds: 60*30
      }
    }
  }, {
    urlPattern: /^http:\/\//,
    handler: 'cacheFirst',
    options: {
      cache: {
        maxAgeSeconds: 60*30
      }
    }
  }]
}
