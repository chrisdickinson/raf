module.exports = raf

var EE = require('events').EventEmitter

var _raf =
  this.requestAnimationFrame ||
  this.webkitRequestAnimationFrame ||
  this.mozRequestAnimationFrame ||
  this.msRequestAnimationFrame ||
  this.oRequestAnimationFrame ||
  (this.setImmediate ? function(fn, el) {
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

    ee.emit('data', dt)

    if(!ee.paused) {
      _raf(iter, el)
    }
  }
}

raf.now = function() { return Date.now() }
