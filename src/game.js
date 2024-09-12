"use strict"

const IDX_DOM_OBJECT = 0
const IDX_POSITION_X = 1
const IDX_POSITION_Y = 2
const IDX_SPRITE_INDEX = 3
const IDX_OBJECT_TYPE = 4
const IDX_PHASE = 5
const IDX_TIME_LEFT = 6
const IDX_SPEED_X = 7

const OBJECT_TYPE_PLAYER = 1
const OBJECT_TYPE_ENEMY = 2
const OBJECT_TYPE_BEAM = 3

const MAX_SPEED = 75
const MAX_OBJECT_Y_COORD = 150
const BEAM_SPEED = 80

let _scrollSpeed = 40
let _width = 800
let _scale
let _mousePosition = 0
let _t = 0
var a, b, c, d, e

// [ domElement, x, y, spriteIndex ]

let objects = []

function createGameObject(objectType, spriteIndex, color, x, y)
{
	return [ createDomElement(spriteIndex, color), x, y, spriteIndex, objectType, 0, 0, 0 ]
}

function deleteGameObject(obj)
{
	obj[IDX_DOM_OBJECT].parentNode.removeChild(obj[IDX_DOM_OBJECT])
}

function cleanupObjects()
{
	for (var i=objects.length - 1; i>=0; i--)
	{
		var obj = objects[i]
		if (obj[IDX_POSITION_Y] > MAX_OBJECT_Y_COORD || (obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_BEAM && obj[IDX_TIME_LEFT] < 0))
		{
			deleteGameObject(obj)
			objects.splice(i, 1)
		}
	}
}

function updateGameObject(obj, dt)
{
	var r = 0
	if (obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_BEAM)
	{
		r = obj[IDX_PHASE] * 360
		obj[IDX_DOM_OBJECT].style.opacity = obj[IDX_TIME_LEFT]
	}
	updatePositionRotation(obj[IDX_DOM_OBJECT], obj[IDX_POSITION_X], obj[IDX_POSITION_Y], r, 0)
}

function stepPlayerObject(obj, dt)
{
	var targetPosition = clamp(_mousePosition, -0.9, 0.9) * 1.098 * 200 // 1.098 is to compensate for the character not being at the very bottom
	var direction = targetPosition > obj[IDX_POSITION_X] ? 1 : -1
	var speed = Math.min(Math.abs(targetPosition - obj[IDX_POSITION_X]), MAX_SPEED)

	// if (Math.random() < 0.1)
	{
		var tmp = createGameObject(OBJECT_TYPE_BEAM, 4, "#07f", objects[0][IDX_POSITION_X], objects[0][IDX_POSITION_Y] - 5)
		tmp[IDX_PHASE] = Math.random()
		tmp[IDX_TIME_LEFT] = 1.0
		tmp[IDX_SPEED_X] = Math.random() * 150 - 75
		objects.push(tmp)
	}

	obj[IDX_POSITION_X] = obj[IDX_POSITION_X] + speed * direction * 8 * dt
}

function stepEnemyObject(obj, dt)
{
	obj[IDX_POSITION_Y] += _scrollSpeed * dt
}

function stepBeamObject(obj, dt)
{
	obj[IDX_TIME_LEFT] -= dt
	obj[IDX_PHASE] += dt
	obj[IDX_POSITION_Y] -= BEAM_SPEED * dt
	obj[IDX_POSITION_X] += obj[IDX_SPEED_X] * dt
}

let _levelStepCount = 0
function levelStep()
{
	_levelStepCount += 1

	if (getRandomFloat() < 0.01)
	{
		var tmp = createGameObject(OBJECT_TYPE_ENEMY, 1, "#ff0", getRandomInt(-100, 100), -130)
		objects.push(tmp)
	}
}

function levelInit()
{
	objects.push(createGameObject(OBJECT_TYPE_PLAYER, 2, "#cef", 0, 120))
	_randomSeed = 42
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

	levelStep()
	for (var i=0; i<objects.length; i++)
	{
		var obj = objects[i]

		if (obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_PLAYER)
		{
			stepPlayerObject(obj, dt)
		}
		else if (obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_ENEMY)
		{
			stepEnemyObject(obj, dt)
		}
		else // OBJECT_TYPE_BEAM
		{
			stepBeamObject(obj, dt)
		}
		updateGameObject(obj, dt)
	}

	cleanupObjects()

	// road scrolling
	_bg.style.backgroundPosition = "0px " + (_t * _scrollSpeed * 3) + "px"

	// scaling and centering the play area
	_scale = Math.min(document.body.clientHeight / _width, document.body.clientWidth / _width)
	_d.style.transform = "scale(" + _scale + ") perspective(800px)"
	_d.style.left = (document.body.clientWidth / 2) + "px"
}
