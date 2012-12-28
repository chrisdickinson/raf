var test = require('tape')
  , raf = require('./index')

test('continues to emit events', function(t) {
  var canvas = typeof document === "undefined" ? {} : document.createElement('canvas')
    , ee = raf(canvas)
    , times = 0

  t.plan(10)

  canvas.width = canvas.height = 100

  ee
    .on('data', function(dt) {
      t.ok(dt >= 0, "time has passed")
      if(++times == 10) {
        ee.pause()
        t.end() 
      }
    })
})
