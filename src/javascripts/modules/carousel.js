import throttle from "lodash.throttle"
import { products } from "../../html/data/global.json"

export default class Controls {
  constructor(el) {
    this.el = el
    this.init()
    this.bindEvents()
  }

  init() {
    this.slides         = [].slice.call(document.getElementsByClassName('product'))
    this.slidesMap      = this.cacheDetails()
    this.slidesLength   = this.slides.length - 1

    this.current        = 0
    this.transitionDur  = 1700

    this.container      = document.getElementById('container')
    this.productDetails = document.getElementById('product-details')
    this.productName    = this.productDetails.getElementsByClassName('product-name')[0]
    this.productPrice   = this.productDetails.getElementsByClassName('product-price')[0]
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
      this.transitionDur + 100
    ))
  }

  onClick = (e) => {
    let increment = parseInt(e.target.dataset.increment)

    if (increment) {
      let num       = this.calcNum(increment)
      this.newSlide = this.slidesMap[num]

      this.container.style.setProperty('--dir', increment)
      this.container.classList.toggle('-change-bg')
      this.moveSlides()
      this.updateProductDetails(num)
      this.removeClass(num)
    }
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

  moveSlides() {
    this.newSlide.classList.add('-enter')
    this.newSlide.classList.add('-active')
    this.activeSlide.classList.add('-exit')
    this.activeSlide.classList.remove('-active')
  }

  updateProductDetails(n) {
    this.productDetails.classList.add('-exit')

    setTimeout(() => {
      this.productDetails.classList.remove('-exit')
      this.productDetails.classList.add('-enter')
      this.productName.innerHTML  = products[n].name
      this.productPrice.innerHTML = products[n].price
    }, ((this.transitionDur / 2) + 100))
  }

  removeClass(n) {
    setTimeout(() => {
      this.activeSlide.classList.remove('-exit')
      this.newSlide.classList.remove('-enter')
      this.productDetails.classList.remove('-enter')

      this.setActive(n)
    }, this.transitionDur + 50)
  }

  setActive(n) {
    this.current = n
    this.activeSlide = this.newSlide
  }
}
