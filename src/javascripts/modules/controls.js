import throttle from "lodash.throttle"

export default class Controls {
  constructor(el) {
    this.el = el
    this.init()
    this.bindEvents()
  }

  init() {
    let buttons        = this.el.getElementsByClassName('control')
    this.prevBtn       = buttons[0]
    this.nextBtn       = buttons[1]

    this.slides        = [].slice.call(document.getElementsByClassName('product'))
    this.slidesMap     = this.cacheDetails()
    this.slidesLength  = this.slides.length - 1

    this.current       = 0
    this.transitionDur = 2000
  }

  cacheDetails() {
    let map = []

    this.slides.forEach((slide, i) => {
      map[i] = slide

      if (slide.classList.contains('-active')) {
        this.activeSlide = slide
      }
    })

    return map
  }

  bindEvents() {
    this.el.addEventListener('click', throttle(
      this.onClick,
      this.transitionDur + 10
    ))
  }

  onClick = (e) => {
    let increment = parseInt(e.target.dataset.increment)

    if (!increment) {
      return
    }

    let num       = this.calcNum(increment)
    this.newSlide = this.slidesMap[num]
    let enterDir  = increment === 1 ? 'Left' : 'Right'
    let exitDir   = increment === 1 ? 'Right' : 'Left'

    this.moveSlides(enterDir, exitDir)
    this.removeClass(enterDir, exitDir, num)
  }

  calcNum(increment) {
    let num = this.current + increment

    if (num > this.slidesLength) {
      num = 0
    }
    else if (num < 0) {
      num = this.slidesLength
    }

    return num
  }

  moveSlides(enDir, exDir) {
    this.newSlide.classList.add(`-enter${enDir}`)
    this.newSlide.classList.add('-active')
    this.activeSlide.classList.add(`-exit${exDir}`)
    this.activeSlide.classList.remove('-active')
  }

  removeClass(enDir, exDir, n) {
    setTimeout(() => {
      this.activeSlide.classList.remove(`-exit${exDir}`)
      this.newSlide.classList.remove(`-enter${enDir}`)

      this.setActive(n)
    }, this.transitionDur)
  }

  setActive(n) {
    this.current = n
    this.activeSlide = this.newSlide
  }
}
