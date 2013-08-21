module.exports = raf

var EE = require('events').EventEmitter
  , now = require("performance-now")
  , global = typeof window === 'undefined' ? this : window

var _raf =
  global.requestAnimationFrame ||
  global.webkitRequestAnimationFrame ||
  global.mozRequestAnimationFrame ||
  global.msRequestAnimationFrame ||
  global.oRequestAnimationFrame ||
  (global.setImmediate ? function(fn, el) {
    setImmediate(fn)
  } :
  function(fn, el) {
    setTimeout(fn, 0)
  })

function raf(el) {
  var now = raf.now()
    , ee = new EE

  ee.pause = function() { ee.paused = true }
  ee.resume = function() { ee.paused = false }

  _raf(iter, el)

  return ee

  function iter(timestamp) {
    var _now = raf.now()
      , dt = _now - now
    
    now = _now

    if(!ee.paused) {
      ee.emit('data', dt)
    }
    
    _raf(iter, el)
  }
}

raf.polyfill = _raf
raf.now = now

