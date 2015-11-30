require('es6-promise').polyfill()
require('match-media')
require('window.requestanimationframe')
var Backbone = require('backbone')
var Litewrite = require('./litewrite')
var Router = require('./router')
var utils = require('./utils')

// this way we can prevent remotestorage from stealing the url hash
var originalHash = window.location.hash

utils.handleAppcacheUpdates()

var litewrite = new Litewrite()
  .on('ready', startHistory)

litewrite.router = new Router({ litewrite: litewrite })

function startHistory () {
  window.location.hash = originalHash
  Backbone.history.start()
}
