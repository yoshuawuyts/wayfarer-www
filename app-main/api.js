const sheetify = require('sheetify/stream')
const browserify = require('browserify')
const match = require('pathname-match')
const wayfarer = require('wayfarer')
const bankai = require('bankai')
const stream = require('stream')

const router = wayfarer('/404')

module.exports = api

// return the api function
// (req, res, obj) -> rstream
function api (req, res, ctx) {
  return router(match(req.url))(req, res, ctx)
}

const html = bankai.html()
router.on('/', () => html)

const js = bankai.js(browserify, 'client-main')
router.on('/bundle.js', () => js)

const css = bankai.css(sheetify, 'client-main/index.css')
router.on('/bundle.css', () => css)

router.on('/404', function () {
  return function (req, res) {
    res.statusCode = 404
    const pts = new stream.PassThrough()
    pts.end()
    return pts
  }
})
