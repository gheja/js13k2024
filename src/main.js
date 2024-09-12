"use strict";

let root;
let bg;
let _sprites;
let _time_scale = 1.0

function _z(x){
	return x
}

function _zz(x) {
	return x
}

// cache the sprites so there's no need to process them every time
let _spriteCache = [];

function getSprite(x, y, width, height, color)
{
	let a = [x, y, width, height, color].join(",");

	if (!_spriteCache[a])
	{
		let canvas = document.createElement("canvas");
		canvas.width = _z(width);
		canvas.height = _z(height);
		let ctx = canvas.getContext("2d");
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(_sprites, x, y, width, height, 0, 0, _z(width), _z(height));
		ctx.globalCompositeOperation = "source-atop"
		ctx.fillStyle = color
		ctx.fillRect(0, 0, 8, 8)
		_spriteCache[a] = canvas.toDataURL();
	}

	return _spriteCache[a];
}

function createObject(className, index, color)
{
	var tmp = document.createElement("img")
	tmp.className = className
	tmp.src = getSprite(index * 8, 0, 8, 8, color)
	tmp.style.transform = "translateX(30px) translateY(10px) translateZ(30px) rotate(0deg)"
	root.appendChild(tmp)
	return tmp
}

function updatePositionRotation(obj, x, y, r) {
	// obj.style.transform = "translateX(" + _zz(x) + "px) translateY(" + _zz(y) + "px) translateZ(30px) rotate(" + r + "deg)"
	// translateY() here is #b's height / 2
	obj.style.transform = "translateX(" + _zz(x - 20) + "px) translateY(360px) translateZ(" + _zz(y * 3) + "px) rotate(" + r + "deg)"
}

function init()
{
	_sprites = new Image()
	_sprites.addEventListener("load", init2)
	_sprites.src = GFX_SPRITES
}

var a, b, c, d

function init2()
{
	root = document.getElementById("g")
	bg = document.getElementById("b")
	bg.style.background = "url(" + GFX_BACKGROUND + ")"
	bg.style.backgroundSize = "30%"

	a = createObject("p", 0, "#c0f")
	b = createObject("p", 1, "#fc0")
	c = createObject("p", 2, "#cef")
	d = createObject("p", 1, "#3f0")

	window.setInterval(step, 1000/60)
}


let _t = 0;

function step()
{
	_t += 1/60 * _time_scale

	updatePositionRotation(a, Math.sin(_t * 3.70) * 200, Math.sin(_t * 0.57) * 125, 0)
	updatePositionRotation(b, Math.sin(_t * 1.45) * 200, Math.sin(_t * 0.68) * 125, 0)
	updatePositionRotation(c, Math.sin(_t * 1.71) * 200,  Math.sin(_t * 1.00) * 125, 0)
	updatePositionRotation(d, Math.sin(_t * 1.38) * 50,  Math.sin(_t * 1.24) * 125, 0)
	bg.style.backgroundPosition = "0px " + (_t * 100) + "px"
}

window.addEventListener("load", init)
