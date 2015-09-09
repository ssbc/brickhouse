var app  = require('app')
var Menu = require('menu')
var path = require('path')
var http = require('http')

var menu = require('./lib/menu')
var windows = require('./lib/windows')

app.on('ready', function () {
  // setup servers
  require('./lib/sbot').setup()
  http.createServer(require('./lib/http-server')({ port: 7777, servefiles: false })).listen(7777)
  http.createServer(require('./lib/http-server')({ port: 7778, servefiles: true  })).listen(7778)

  // setup ssb protocol
  var protocol = require('protocol')
  protocol.registerProtocol('ssb', function (req, cb) {
    var path = req.url.slice(4) // skip the 'ssb:'
    return new protocol.RequestHttpJob({ url: 'http://localhost:7777/'+path })
  })

  // open launcher window
  windows.openLauncher()
  // mainWindow.openDevTools()

  // dynamically update main menu on osx
  if (process.platform == 'darwin') {
    app.on('browser-window-focus', function (e, window) {
      Menu.setApplicationMenu(window.menu)
    })
  }
});
