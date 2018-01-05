import util from './util.js'
import _event from './event.js'
import Skeleton from '../skeleton.js'

let index = 0//实例化组件数	
let CLASS_RIPPLE = "sk-ripple", CLASS_WRAP = "ripple-wrap"

class Ripple extends Skeleton {
	constructor(options) {
		super()
		let config = {
			elem: ""
		}
		this.config = $.extend(config, options || {})
		this.index = ++index
		this.elem = $(this.config.elem)
		if (this.elem.length < 1) {
			return
		}
		this.init()
	}

	init() {
		this.bindEvent()
	}

	bindEvent() {
		let that = this
		that.elem.click(function (e) {
			let evt = e || window.event
			that.render(evt, $(this))
		})
	}

	render(e, self) {
		let that = this,
			coord = that.getCoordinate(e),
			diameter = Math.max(self.innerWidth(), self.innerHeight()),
			ripple = $('<span class="' + CLASS_RIPPLE + '"></span>')

		ripple.css({
			width: diameter + 'px',
			height: diameter + 'px'
		})

		let x = coord.x - self.offset().left - ripple.width() / 2,
			y = coord.y - self.offset().top - ripple.height() / 2

		ripple.css({
			top: y + 'px',
			left: x + 'px'
		})

		self.addClass(CLASS_WRAP).append(ripple)

		ripple.addClass("ripple-animate")

		ripple.one('animationend webkitAnimationEnd oanimationend MSAnimationEnd', function () {
			$(this).remove()
		})
	}

	getCoordinate(e) {
		let docElem = scrollTop = document.documentElement, docBody = document.body,
			scrollTop = docElem.scrollTop || docBody.scrollTop,
			scrollLeft = docElem.scrollLeft || docBody.scrollLeft,
			clientTop = docElem.clientTop || docBody.clientTop,
			clientLeft = docElem.clientLeft || docBody.clientLeft

		let pageX = e.pageX ? e.pageX : e.clientX + scrollLeft - clientLeft,
			pageY = e.pageY ? e.pageY : e.clientY + scrollTop - clientTop

		return {
			x: pageX,
			y: pageY
		}
	}

}

Skeleton.ripple = function (options) {
	return new Ripple(options)
}



