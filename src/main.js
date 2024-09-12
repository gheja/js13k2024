"use strict"

let _d
let _root
let _bg
let _messageDomObject
let _sprites
let _time_scale = 1.0

function init()
{
	_sprites = new Image()
	_sprites.addEventListener("load", init2)
	_sprites.src = GFX_SPRITES
}

function init2()
{
	_d = document.getElementById("d")
	_root = document.getElementById("g")
	_bg = document.getElementById("b")
	_messageDomObject = document.getElementById("m")
	_bg.style.background = "url(" + GFX_BACKGROUND + ")"
	_bg.style.backgroundSize = "30%"
	gameInit()
}

window.addEventListener("load", init)
