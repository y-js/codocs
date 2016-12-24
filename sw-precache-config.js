/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/images/favicon.ico',
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-lite.min.js',
    '/fonts/fonts.css',
    '/yjs-webworker.js',
    '/bower_components/yjs/y.js',
    '/bower_components/y-memory/y-memory.js',
    '/bower_components/y-indexeddb/y-indexeddb.js',
    '/bower_components/y-websockets-client/y-websockets-client.js',
    '/bower_components/y-webworker/yjs-webworker-service.js',
    '/bower_components/ace-builds/src-min-noconflict/mode-markdown.js',
    '/bower_components/ace-builds/src-min-noconflict/mode-latex.js',
    '/bower_components/KaTeX/dist/fonts/KaTeX_Main-Regular.woff2',
    '/bower_components/KaTeX/dist/fonts/KaTeX_Main-Italic.woff2',
    'bower_components/texlive.js/**/*',
    'bower_components/pdfjs-dist/build/pdf.worker.min.js'
  ],
  navigateFallback: '/index.html',
  runtimeCaching: [{
    urlPattern: /\/fonts\/(.*)/,
    handler: 'cacheFirst'
  }]
};
