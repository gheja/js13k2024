"use strict"

const ENEMY_DEFINITIONS = [
	[ 1, "#ff0", 0, 0 ],
	[ 1, "#f30", 50, 0 ],
	[ 0, "#c0f", 0, 20 ],
	[ 0, "#2f8", 70, 20 ],
	[ 0, "#00f", 100, 100 ],
	[ 0, "#0f0", 100, 100 ] 
]

const STATE_INIT = 0
const STATE_TEXT = 1
const STATE_RUNNING = 2
const STATE_WON = 3

const EIDX_SPRITE_INDEX = 0
const EIDX_COLOR = 1
const EIDX_WOBBLE_X = 2
const EIDX_SPEED_Y = 3

const IDX_DOM_OBJECT = 0
const IDX_POSITION_X = 1
const IDX_POSITION_Y = 2
const IDX_SPRITE_INDEX = 3
const IDX_OBJECT_TYPE = 4
const IDX_PHASE = 5
const IDX_TIME_LEFT = 6
const IDX_SPEED_X = 7
const IDX_SPEED_Y = 8
const IDX_WOBBLE_X = 9
const IDX_POSITION_WOBBLE_X = 10
const IDX_ENEMY_DEFINITION_INDEX = 11

const OBJECT_TYPE_PLAYER = 1
const OBJECT_TYPE_ENEMY = 2
const OBJECT_TYPE_BEAM = 3

const PLAYER_MAX_SPEED = 75
const MAX_OBJECT_Y_COORD = 150
const BEAM_SPEED = 60
const BEAM_CATCH_DISTANCE = 5
const BEAM_INTERVAL_SEC = 0.0166

const LEVEL_STEP_INTERVAL_SEC = 0.1

let _state = STATE_INIT
let _scrollSpeed = 80
let _width = 800
let _scale
let _mousePosition = 0
let _t = 0
var a, b, c, d, e
var _enemiesCaught

// [ domElement, x, y, spriteIndex ]

let objects = []

function createGameObject(objectType, spriteIndex, color, x, y)
{
	return [ createDomElement(spriteIndex, color), x, y, spriteIndex, objectType, 0, 0, 0, 0, 0, 0, 0 ]
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
		r = obj[IDX_PHASE] * 360 * 2
		obj[IDX_DOM_OBJECT].style.opacity = obj[IDX_TIME_LEFT]
	}
	updatePositionRotation(obj[IDX_DOM_OBJECT], obj[IDX_POSITION_X] + obj[IDX_POSITION_WOBBLE_X], obj[IDX_POSITION_Y], r, 0)
}

function stepPlayerObject(obj, dt)
{
	var targetPosition = clamp(_mousePosition, -0.9, 0.9) * 1.098 * 200 // 1.098 is to compensate for the character not being at the very bottom
	var direction = targetPosition > obj[IDX_POSITION_X] ? 1 : -1
	var speed = Math.min(Math.abs(targetPosition - obj[IDX_POSITION_X]), PLAYER_MAX_SPEED)

	obj[IDX_POSITION_X] = obj[IDX_POSITION_X] + speed * direction * 8 * dt
}

function enemyCaught(obj)
{
	// make sure it will be cleaned up
	obj[IDX_POSITION_Y] = MAX_OBJECT_Y_COORD

	_enemiesCaught[obj[IDX_ENEMY_DEFINITION_INDEX]] += 1
	
	updateScores()
}

function stepEnemyObject(obj, dt)
{
	obj[IDX_POSITION_Y] += _scrollSpeed * dt
	obj[IDX_POSITION_Y] += obj[IDX_SPEED_Y] * dt
	obj[IDX_PHASE] += dt
	obj[IDX_POSITION_WOBBLE_X] = obj[IDX_WOBBLE_X] * Math.sin(obj[IDX_PHASE])

	for (var obj2 of objects)
	{
		if (obj2[IDX_OBJECT_TYPE] == OBJECT_TYPE_BEAM)
		{
			if (obj2[IDX_TIME_LEFT] > 0.2 && dist(obj, obj2) < BEAM_CATCH_DISTANCE)
			{
				enemyCaught(obj)
			}
		}
	}
}

var _nextBeamObjectTime = 0

function createBeamObjects()
{
	while (_nextBeamObjectTime < _t)
	{
		var tmp = createGameObject(OBJECT_TYPE_BEAM, 4, arrayPick([ "#07f", "#4af", "#09f", "#a3f" ]), objects[0][IDX_POSITION_X], objects[0][IDX_POSITION_Y] - 1)
		tmp[IDX_PHASE] = Math.random()
		tmp[IDX_TIME_LEFT] = 1.0
		tmp[IDX_SPEED_X] = Math.random() * 150 - 75
		objects.push(tmp)

		_nextBeamObjectTime += BEAM_INTERVAL_SEC
	}
}

function stepBeamObject(obj, dt)
{
	obj[IDX_TIME_LEFT] -= dt
	obj[IDX_PHASE] += dt
	obj[IDX_POSITION_Y] -= BEAM_SPEED * dt
	obj[IDX_POSITION_X] += obj[IDX_SPEED_X] * dt
}

let _levelData
let _levelStepCount = 0
let _nextLevelStepTime = 0
let _levelStepSkip = 0

function levelStep()
{
	while (_nextLevelStepTime < _t)
	{
		_levelStepCount += 1

		// interpolate between the min and max level speed, limit to 60 sec
		_scrollSpeed = _levelData[2] + (clamp(_t, 0, 60) / 60) * (_levelData[3] - _levelData[2])

		if (_levelStepSkip <= 0)
		{
			var i = getRandomIndexWeighted(_levelData[7])
			var e = ENEMY_DEFINITIONS[i]
			var tmp = createGameObject(OBJECT_TYPE_ENEMY, e[EIDX_SPRITE_INDEX], e[EIDX_COLOR], getRandomInt(-100, 100), -130)
			tmp[IDX_WOBBLE_X] = e[EIDX_WOBBLE_X]
			tmp[IDX_SPEED_Y] = e[EIDX_SPEED_Y]
			tmp[IDX_ENEMY_DEFINITION_INDEX] = i
			objects.push(tmp)

			_levelStepSkip = getRandomInt(_levelData[0], _levelData[1])
		}

		_nextLevelStepTime += LEVEL_STEP_INTERVAL_SEC
		_levelStepSkip -= 1
	}
}

function levelInit(levelIndex)
{
	_t = 0
	_nextBeamObjectTime = 0
	_nextLevelStepTime = 0

	_levelData = LEVELS[levelIndex]

	_scrollSpeed = _levelData[2]
	_randomSeed = _levelData[4]
	_enemiesCaught =  [ 0, 0, 0, 0, 0, 0 ]

	// TODO: remove all dom objects
	// TODO? should the level step be tied to scroll speed?

	objects = []
	objects.push(createGameObject(OBJECT_TYPE_PLAYER, 2, "#cef", 0, 120))

	_state = STATE_RUNNING
}

function gameInit()
{
	levelInit(0)
	updateScores()
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

function updateScores()
{
	var total1 = 0
	var total2 = 0

	for (var i=0; i<ENEMY_DEFINITIONS.length; i++)
	{
		var obj = document.getElementById("s" + i)
		obj.style.display = (_levelData[8][i] == 0 ? "none" : "")
		obj.style.color = ENEMY_DEFINITIONS[i][EIDX_COLOR]
		obj.innerHTML = _enemiesCaught[i] + " / " + _levelData[8][i]
		total1 += _enemiesCaught[i]
		total2 += _levelData[8][i]
	}

	var obj = document.getElementById("st")
	obj.innerHTML = "Total: " + total1 + " / " + total2
}

function checkWinCondition()
{
	for (var i=0; i<ENEMY_DEFINITIONS.length; i++)
	{
		if (_enemiesCaught[i] < _levelData[8][i])
		{
			return false
		}
	}

	return true
}

var _messages = []
var _messageInterval
var _messageIndex = 0

function popupMessageAnimation()
{
	_messageDomObject.style.animation = ""
}

function popupNextMessage()
{
	if (_messages.length == 0)
	{
		_state = STATE_RUNNING
		return
	}

	_messageDomObject.innerHTML = _messages.shift()
	_messageDomObject.style.animation = "none"
	window.setTimeout(popupMessageAnimation, 0)
	window.setTimeout(popupNextMessage, _messageInterval)
}

function popUpMessages(messages, interval)
{
	_messages = messages
	_messageInterval = interval

	popupNextMessage()

	_state = STATE_TEXT
}

function timescaleStep()
{
	var target = 0.1

	if (_state == STATE_RUNNING)
	{
		target = 1.0
	}

	_time_scale += (target - _time_scale) * 0.05
}

var _bgPositionY = 0

function step()
{
	var dt = 1/60 * _time_scale

	_t += dt

	timescaleStep()
	levelStep()
	createBeamObjects()

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

	if (checkWinCondition())
	{
		_state = STATE_WON
		console.log("win!")
		popUpMessages([ "Congrats!", "You won", "Asdf", "Ghe" ], 3000)
	}

	// road scrolling
	_bgPositionY += _scrollSpeed * dt
	_bg.style.backgroundPosition = "0px " + (_bgPositionY * 3) + "px"

	// scaling and centering the play area
	_scale = Math.min(document.body.clientHeight / _width, document.body.clientWidth / _width)
	_d.style.transform = "scale(" + _scale + ") perspective(800px)"
	_d.style.left = (document.body.clientWidth / 2) + "px"
}
