"use strict";

let _t = 0;
var a, b, c, d, e

function gameInit()
{
	a = createObject("p", 0, "#c0f")
	b = createObject("p", 1, "#fc0")
	c = createObject("p", 2, "#cef")
	d = createObject("p", 1, "#3f0")

	// a shadow
	// e = createObject("p", 1, "#000")
	e = createObject("p", 3, "#000")

	window.setInterval(step, 1000/60)
}

function step()
{
	_t += 1/60 * _time_scale

	updatePositionRotation(a, Math.sin(_t * 3.70) * 200, Math.sin(_t * 0.57) * 125,  0, 0)
	updatePositionRotation(b, Math.sin(_t * 1.45) * 200, Math.sin(_t * 0.68) * 125,  0, 0)
	updatePositionRotation(c, Math.sin(_t * 1.71) * 200,  Math.sin(_t * 1.00) * 125, 0, 0)
	updatePositionRotation(d, Math.sin(_t * 1.38) * 50,  Math.sin(_t * 1.24) * 125,  0, 0)

	updatePositionRotation(e, Math.sin(_t * 1.38) * 50,  Math.sin(_t * 1.24) * 125,  0, 1)

	// road scrolling
	bg.style.backgroundPosition = "0px " + (_t * 100) + "px"

	// scaling and centering the play area
	var s = Math.min(document.body.clientHeight / 800, document.body.clientWidth / 800)
	_d.style.transform = "scale(" + s + ") perspective(800px)"
	_d.style.left = (document.body.clientWidth / 2) + "px"
}
