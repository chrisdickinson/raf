module.exports = raf

var EE = require('events').EventEmitter
  , _raf = require('./polyfill.js')
  , global = require('./window.js')
  , now = global.performance && global.performance.now ? function() {
    return performance.now()
  } : Date.now || function () {
    return +new Date()
  }


function raf(el, tick) {
  var now = raf.now()
    , ee = new EE
    
  if(typeof el === 'function') {
    tick = el
    el = undefined
  }
  
  ee.pause = function() { ee.paused = true }
  ee.resume = function() {
    if(ee.paused) {
      _raf.call(global, iter, el)
    }
    ee.paused = false
  }

  _raf.call(global, iter, el)
  
  if(tick) {
    ee.on('data', function(dt) {
      tick(dt)
    })
  }

  return ee

  function iter(timestamp) {
    var _now = raf.now()
      , dt = _now - now
    
    now = _now

    if(!ee.paused) {
      ee.emit('data', dt)
    }
    // Check paused status again in
    // case `pause()` was invoked by
    // one of the 'data' listeners
    if(!ee.paused) {
      _raf.call(global, iter, el)
    }
  }
}

raf.polyfill = _raf
raf.now = now

