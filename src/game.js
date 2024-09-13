"use strict"

const ENEMY_DEFINITIONS = [
	[ 1, "#faa032", 0, 0 ],
	[ 1, "#c40c2e", 50, 0 ],
	[ 0, "#e29bfa", 0, 20 ],
	[ 0, "#55b33b", 70, 20 ],
	[ 0, "#25acf5", 100, 100 ],
	[ 0, "#b58c7f", 100, 100 ],
]

const STATE_INIT = 0
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
const IDX_ENEMY_GROUP_LEADER = 12
const IDX_ENEMY_GROUP_SHIFT_X = 13
const IDX_POSITION_Z = 14
const IDX_SPEED_Z = 15

const OBJECT_TYPE_PLAYER = 1
const OBJECT_TYPE_ENEMY = 2
const OBJECT_TYPE_BEAM = 3
const OBJECT_TYPE_PARTICLE = 4

const PLAYER_MAX_SPEED = 75
const MAX_OBJECT_Y_COORD = 150
const BEAM_SPEED = 60
const BEAM_CATCH_DISTANCE = 5
const BEAM_INTERVAL_SEC = 0.0166

const LEVEL_STEP_INTERVAL_SEC = 0.1

const OOF_TIME_MAX = 2.5

let _state = STATE_INIT
let _dialogOpen = false
let _oofActive = false
let _scrollSpeed = 80
let _width = 800
let _scale
let _mousePosition = 0
let _t = 0
let a, b, c, d, e
let _enemiesCaught
let _oofTimeLeft

// [ domElement, x, y, spriteIndex ]

let objects = []

function createGameObject(objectType, spriteIndex, color, x, y)
{
	return [ createDomElement(spriteIndex, color), x, y, spriteIndex, objectType, 0, 0, 0, 0, 0, 0, 0, null, 0, 0, 0 ]
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
		if (obj[IDX_POSITION_Y] > MAX_OBJECT_Y_COORD || ((obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_BEAM || obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_PARTICLE) && obj[IDX_TIME_LEFT] < 0))
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

	if (obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_PARTICLE)
	{
		r = obj[IDX_PHASE] * 360 * -0.5
		obj[IDX_DOM_OBJECT].style.opacity = obj[IDX_TIME_LEFT]
	}
	updatePositionRotation(obj[IDX_DOM_OBJECT], obj[IDX_POSITION_X] + obj[IDX_POSITION_WOBBLE_X], obj[IDX_POSITION_Y], obj[IDX_POSITION_Z], r)
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

function enemyGroupCaught(obj)
{
	var leader = obj[IDX_ENEMY_GROUP_LEADER]

	if (leader)
	{
		enemyGroupCaught(leader)
		return
	}

	enemyCaught(obj)

	for (var obj2 of objects)
	{
		if (obj2[IDX_ENEMY_GROUP_LEADER] && obj == obj2[IDX_ENEMY_GROUP_LEADER])
		{
			enemyCaught(obj2)
		}
	}
}

function stepEnemyObject(obj, dt)
{
	if (obj[IDX_ENEMY_GROUP_LEADER])
	{
		var leader = obj[IDX_ENEMY_GROUP_LEADER]
		obj[IDX_POSITION_X] = leader[IDX_POSITION_X] + obj[IDX_ENEMY_GROUP_SHIFT_X]
		obj[IDX_POSITION_Y] = leader[IDX_POSITION_Y]
		obj[IDX_POSITION_WOBBLE_X] = leader[IDX_POSITION_WOBBLE_X]
		obj[IDX_PHASE] = leader[IDX_PHASE]
	}
	else
	{
		obj[IDX_POSITION_Y] += _scrollSpeed * dt
		obj[IDX_POSITION_Y] += obj[IDX_SPEED_Y] * dt
		obj[IDX_PHASE] += dt
		obj[IDX_POSITION_WOBBLE_X] = obj[IDX_WOBBLE_X] * Math.sin(obj[IDX_PHASE])
	}

	for (var obj2 of objects)
	{
		if (obj2[IDX_OBJECT_TYPE] == OBJECT_TYPE_BEAM)
		{
			if (obj2[IDX_TIME_LEFT] > 0.2 && dist(obj, obj2) < BEAM_CATCH_DISTANCE)
			{
				enemyGroupCaught(obj)
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
		tmp[IDX_TIME_LEFT] = _levelData[10]
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

function stepParticleObject(obj, dt)
{
	obj[IDX_POSITION_X] += obj[IDX_SPEED_X] * dt
	obj[IDX_POSITION_Y] += obj[IDX_SPEED_Y] * dt
	obj[IDX_POSITION_Z] += obj[IDX_SPEED_Z] * dt
	obj[IDX_PHASE] += dt
	obj[IDX_TIME_LEFT] -= dt
}

let _currentLevelIndex = -1
let _levelData
let _levelStepCount = 0
let _nextLevelStepTime = 0
let _levelStepSkip = 0

function levelStep()
{
	function create()
	{
		var i = getRandomIndexWeighted(_levelData[7])
		var e = ENEMY_DEFINITIONS[i]
		var tmp = createGameObject(OBJECT_TYPE_ENEMY, e[EIDX_SPRITE_INDEX], e[EIDX_COLOR], getRandomInt(-100, 100), -130)
		tmp[IDX_WOBBLE_X] = e[EIDX_WOBBLE_X]
		tmp[IDX_SPEED_Y] = e[EIDX_SPEED_Y]
		tmp[IDX_ENEMY_DEFINITION_INDEX] = i
		objects.push(tmp)

		return tmp
	}

	while (_nextLevelStepTime < _t)
	{
		_levelStepCount += 1

		// interpolate between the min and max level speed, limit to 60 sec
		_scrollSpeed = _levelData[2] + (clamp(_t, 0, 60) / 60) * (_levelData[3] - _levelData[2])

		if (_levelStepSkip <= 0)
		{
			var leader = create()
			var group = getRandomIndexWeighted(_levelData[9])

			while (group > 0)
			{
				var follower = create()
				follower[IDX_ENEMY_GROUP_LEADER] = leader
				follower[IDX_ENEMY_GROUP_SHIFT_X] = group * 40
				group -= 1
			}
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

	// TODO? should the level step be tied to scroll speed?

	// delete all child objects the hacky way
	_root.innerHTML = ""

	objects = []
	objects.push(createGameObject(OBJECT_TYPE_PLAYER, 2, "#5cf", 0, 120))

	_state = STATE_RUNNING

	popUpMessages(_levelData[5])
}

function loadNextLevel()
{
	_currentLevelIndex += 1
	levelInit(_currentLevelIndex)
	updateScores()
}

function gameInit()
{
	loadNextLevel()
	// popUpMessages([ "Welcome!" ])
	window.setInterval(step, 1000/60)
	window.addEventListener("mousemove", onMouseMove)
	_mb.addEventListener("click", dismissDialog)
}

function onMouseMove(event)
{
	let a = event.clientX - document.body.clientWidth / 2
	a = a / _scale
	a = a / (_width / 2)
	_mousePosition = a
}

function throwEnemyAsParticle(e)
{
	var tmp = createGameObject(OBJECT_TYPE_PARTICLE, ENEMY_DEFINITIONS[e][EIDX_SPRITE_INDEX], ENEMY_DEFINITIONS[e][EIDX_COLOR], objects[0][IDX_POSITION_X], objects[0][IDX_POSITION_Y] - 1)
	tmp[IDX_PHASE] = Math.random()
	tmp[IDX_TIME_LEFT] = 1.0
	tmp[IDX_SPEED_X] = Math.random() * 600 - 300
	tmp[IDX_SPEED_Z] = Math.random() * -300
	objects.push(tmp)
}

function oofExecute()
{
	var totalCatches = 0
	for (var i=0; i<ENEMY_DEFINITIONS.length; i++)
	{
		totalCatches += _enemiesCaught[i]
	}

	var catchesToSteal = Math.floor(Math.max(5, totalCatches * 0.3))

	while (catchesToSteal > 0)
	{
		a = Math.floor(Math.random() * ENEMY_DEFINITIONS.length)
		if (_enemiesCaught[a] == 0)
		{
			continue
		}

		throwEnemyAsParticle(a)
		_enemiesCaught[a] -= 1
		catchesToSteal -= 1

		// make sure it won't happen again right away
		if (_enemiesCaught[a] > 0 && _enemiesCaught[a] % 13 == 0)
		{
			throwEnemyAsParticle(a)
			_enemiesCaught[a] -= 1
			catchesToSteal -= 1
		}
	}

	_o.style.animation = "o 0.33s forwards"
	_time_scale = 0.0

	updateScores()
}

function oofStart()
{
	if (_oofActive)
	{
		return
	}

	_oofActive = true
	_oofTimeLeft = OOF_TIME_MAX
}

function oofStop()
{
	_oofActive = false
}

function oofStep(dt)
{
	if (!_oofActive)
	{
		_w.style.width = 0
		return
	}

	_oofTimeLeft = clamp(_oofTimeLeft - dt, 0, OOF_TIME_MAX)
	_w.style.width = ((1 - (_oofTimeLeft / OOF_TIME_MAX)) * 100) + "%"

	if (_oofTimeLeft == 0)
	{
		oofExecute()
		_oofActive = false
	}
}

function updateScores()
{
	var total1 = 0
	var total2 = 0
	var oof = false

	for (var i=0; i<ENEMY_DEFINITIONS.length; i++)
	{
		var obj = document.getElementById("s" + i)
		obj.style.display = (_levelData[8][i] == 0 ? "none" : "")
		obj.style.color = ENEMY_DEFINITIONS[i][EIDX_COLOR]
		obj.innerHTML = _enemiesCaught[i] + " / " + _levelData[8][i]
		total1 += _enemiesCaught[i]
		total2 += _levelData[8][i]
		obj.style.background = ""

		if (_enemiesCaught[i] > 0)
		{
			if (_enemiesCaught[i] % 13 == 12)
			{
				obj.style.background = "#ea08"
			}
			else if (_enemiesCaught[i] % 13 == 0)
			{
				obj.style.background = "#f008"
				oof = true
			}
			else if (_enemiesCaught[i] >= _levelData[8][i])
			{
				obj.style.background = "#0f05"
			}
		}
	}

	var obj = document.getElementById("st")
	obj.innerHTML = "Total: " + total1 + " / " + total2
	obj.style.background = ""

	if (total1 > 0)
	{
		if (total1 % 13 == 12)
		{
			obj.style.background = "#ea08"
		}
		else if (total1 % 13 == 0)
		{
			obj.style.background = "#f008"
			oof = true
		}
	}

	if (oof)
	{
		oofStart()
	}
	else
	{
		oofStop()
	}
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

function popupNextMessage()
{
	if (_messages.length == 0)
	{
		_dialogOpen = false
		return
	}

	_dialogOpen = true

	_m.innerHTML = _messages.shift()
	_m.style.opacity = 1
	_mb.style.opacity = 1
}

function popUpMessages(messages)
{
	_messages = messages

	popupNextMessage()
}

function dismissDialog()
{
	_m.style.opacity = 0
	_mb.style.opacity = 0

	if (_messages.length == 0)
	{
		_dialogOpen = false
		if (_state == STATE_INIT || _state == STATE_WON)
		{
			loadNextLevel()
		}
	}
	else
	{
		window.setTimeout(popupNextMessage, 200)
	}
}

function timescaleStep()
{
	var target = 0.1

	if (_dialogOpen)
	{
		target = 0
	}
	else
	{
		if (_state == STATE_RUNNING)
		{
			target = 1.0
		}
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
		else if (obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_BEAM)
		{
			stepBeamObject(obj, dt)
		}
		else if (obj[IDX_OBJECT_TYPE] == OBJECT_TYPE_PARTICLE)
		{
			stepParticleObject(obj, dt)
		}
			
		updateGameObject(obj, dt)
	}

	cleanupObjects()

	oofStep(dt)

	if (_state == STATE_RUNNING)
	{
		if (checkWinCondition())
		{
			_state = STATE_WON
			popUpMessages(_levelData[6])
		}
	}

	// road scrolling
	_bgPositionY += _scrollSpeed * dt
	_bg.style.backgroundPosition = "0px " + (_bgPositionY * 3) + "px"

	// scaling and centering the play area
	_scale = Math.min(document.body.clientHeight / _width, document.body.clientWidth / _width)
	_d.style.transform = "scale(" + _scale + ") perspective(800px)"
	_d.style.left = (document.body.clientWidth / 2) + "px"
}
