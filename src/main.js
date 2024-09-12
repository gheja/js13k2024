"use strict"

let _d     // the base for the 3d scene
let _root  // conatiner for the objects
let _bg    // background layer
let _m     // message div
let _mb    // message button
let _w     // warning bar at top
let _sprites  // decoded from the const
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
	_m = document.getElementById("m")
	_mb = document.getElementById("mb")
	_w = document.getElementById("w")

	_bg.style.background = "url(" + GFX_BACKGROUND + ")"
	_bg.style.backgroundSize = "30%"

	gameInit()
}

window.addEventListener("load", init)
