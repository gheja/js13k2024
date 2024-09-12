"use strict"

let _width = 800
let _scale
let _mousePosition = 0
let _t = 0
var a, b, c, d, e

// [ domElement, x, y, spriteIndex ]

let playerObject
let objects = []

function createGameObject(className, spriteIndex, color, x, y)
{
	return [ createDomElement(className, spriteIndex, color), x, y, spriteIndex ]
}

function updateGameObject(obj, dt)
{
	updatePositionRotation(obj[0], obj[1], obj[2], 0, 0)
}

function stepPlayerObject(obj, dt)
{
	var a = clamp(_mousePosition, -0.9, 0.9) * 1.098 * 200
	obj[1] = obj[1] + (a - obj[1]) * 3 * dt
}

function stepEnemyObject(obj, dt)
{
	obj[1] += dt * 10
}

function levelInit()
{
	playerObject = createGameObject("p", 2, "#cef", 0, 0)
	playerObject[1] = 0
	playerObject[2] = 120
}

function gameInit()
{
	levelInit()
	window.setInterval(step, 1000/60)
	window.addEventListener("mousemove", onMouseMove)
}

function onMouseMove(event)
{
	let a = event.clientX - document.body.clientWidth / 2
	a = a / _scale
	a = a / (_width / 2)
	_mousePosition = a
}

function step()
{
	var dt = 1/60 * _time_scale

	_t += dt

	stepPlayerObject(playerObject, dt)
	updateGameObject(playerObject, dt)

	// road scrolling
	_bg.style.backgroundPosition = "0px " + (_t * 100) + "px"

	// scaling and centering the play area
	_scale = Math.min(document.body.clientHeight / _width, document.body.clientWidth / _width)
	_d.style.transform = "scale(" + _scale + ") perspective(800px)"
	_d.style.left = (document.body.clientWidth / 2) + "px"
}
