const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 8000

function serveFile (relativePath) {
  return function (req, res) {
    res.sendFile(path.join(__dirname, '..', relativePath))
  }
}

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('./webpack.config')
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    noInfo: true
  }))

  app.use(webpackHotMiddleware(compiler))

  app.get('/', function (req, res) {
    fs.readFile(path.join(__dirname, '../index.html'), 'utf8', function (err, file) {
      if (err) res.send(500)
      var withoutManifest = file.replace('<html manifest="cache.manifest">', '<html>')
      res.send(withoutManifest)
    })
  })
} else {
  app.get('/', serveFile('index.html'))
  app.get('/litewrite.min.js', serveFile('litewrite.min.js'))
}

app.use('/img', express.static(path.join(__dirname, '../img')))
app.use('/style', express.static(path.join(__dirname, '../style')))
app.get('/cache.manifest', serveFile('cache.manifest'))

if (require.main === module) {
  app.listen(port, function (error) {
    if (error) {
      console.error(error)
    } else {
      console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
    }
  })
}

module.exports = app
