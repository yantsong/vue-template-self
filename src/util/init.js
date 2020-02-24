import FastClick from 'fastclick'

export default function () {
  // fast click
  FastClick.attach(document.body)
  // 禁止缩放
  document.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  var lastTouchEnd = 0

  document.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime()

    if (now - lastTouchEnd <= 300) {
      event.preventDefault()
    }

    lastTouchEnd = now
  }, false)
  // iOS 禁止缩放
  document.addEventListener('gesturestart', function (event) {
    event.preventDefault()
  })
}
