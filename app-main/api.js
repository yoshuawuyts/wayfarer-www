const sheetify = require('sheetify/stream')
const hyperstream = require('hyperstream')
const browserify = require('browserify')
const match = require('pathname-match')
const wayfarer = require('wayfarer')
const bankai = require('bankai')
const stream = require('stream')
const path = require('path')
const fs = require('fs')

const router = wayfarer('/404')

module.exports = api

// return the api function
// (req, res, obj) -> rstream
function api (req, res, ctx) {
  return router(match(req.url), req, res, ctx)
}

// html
const html = bankai.html()
router.on('/', function (params, req, res) {
  return html(req, res).pipe(hyperstream({
    body: { _appendHtml: readHtml('index.html') }
  }))

  function readHtml (file) {
    const clientPath = path.dirname(require.resolve('client-main'))
    return fs.createReadStream((path.join(clientPath, file)))
  }
})

// js
const js = bankai.js(browserify, 'client-main')
router.on('/bundle.js', (params, req, res) => js(req, res))

// css
const css = bankai.css(sheetify, 'client-main/index.css', {
  use: [ 'sheetify-cssnext' ]
})
router.on('/bundle.css', (params, req, res) => css(req, res))

// 404
router.on('/404', function (params, req, res) {
  res.statusCode = 404
  const pts = new stream.PassThrough()
  pts.end()
  return pts
})
