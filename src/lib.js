"use strict"

function _z(x)
{
	return x
}

function _zz(x)
{
	return x
}

// cache the sprites so there's no need to process them every time
let _spriteCache = []

function clamp(x, min, max)
{
	return (x < min ? min : (x > max ? max : x))
}

function getSprite(x, y, width, height, color)
{
	let a = [x, y, width, height, color].join(",")

	if (!_spriteCache[a])
	{
		let canvas = document.createElement("canvas")
		canvas.width = _z(width)
		canvas.height = _z(height)

		let ctx = canvas.getContext("2d")
		ctx.imageSmoothingEnabled = false
		ctx.drawImage(_sprites, x, y, width, height, 0, 0, _z(width), _z(height))

        // modulation
		ctx.globalCompositeOperation = "source-atop"
		ctx.fillStyle = color
		ctx.fillRect(0, 0, 8, 8)

		_spriteCache[a] = canvas.toDataURL()
	}

	return _spriteCache[a]
}

function createDomElement(index, color)
{
	var tmp = document.createElement("img")
	tmp.src = getSprite(index * 8, 0, 8, 8, color)
	_root.appendChild(tmp)
	return tmp
}

function updatePositionRotation(obj, x, y, r, floor)
{
	// translateY() here is #b's height / 2
	obj.style.transform = "translateX(" + _zz(x - 20) + "px) translateY(" + (floor ? 379.9 : 360) + "px) translateZ(" + _zz(y * 3) + "px) rotate(" + r + "deg) rotateX(" + (floor ? 90 : 0) + "deg)"
}

function dist(obj1, obj2)
{
	// Manhattan distance - close enough
	// return Math.abs(obj1[IDX_POSITION_X] - obj2[IDX_POSITION_X]) + Math.abs(obj1[IDX_POSITION_Y] - obj2[IDX_POSITION_Y])
	return Math.abs((obj1[IDX_POSITION_X] + obj1[IDX_POSITION_WOBBLE_X]) - (obj2[IDX_POSITION_X] + obj2[IDX_POSITION_WOBBLE_X])) + Math.abs(obj1[IDX_POSITION_Y] - obj2[IDX_POSITION_Y])
}

function arrayPick(arr)
{
	return arr[Math.floor(Math.random() * arr.length)]
}
