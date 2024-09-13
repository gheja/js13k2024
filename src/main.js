"use strict"

let _d     // the base for the 3d scene
let _root  // conatiner for the objects
let _bg    // background layer
let _m     // message div
let _mb    // message button
let _w     // warning bar at top
let _o     // overlay
let _q     // "click to start" overlay
let _r     // cover overlay
let _sprites  // decoded from the const
let _time_scale = 0.0

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
	_o = document.getElementById("o")
	_q = document.getElementById("q")
	_r = document.getElementById("r")

	_o.addEventListener("animationend", function() { this.style.animation = "none" })

	_bg.style.background = "url(" + GFX_BACKGROUND + ")"
	_bg.style.backgroundSize = "30%"

	_r.style.background = "url(" + GFX_COVER + ")"
	_r.style.backgroundSize = "30%"

	_q.innerHTML = "Click to start"
	_q.addEventListener("click", init3)
}

function init3()
{
	_q.parentNode.removeChild(_q)
	gameInit()
	soundManagerInit()
}

window.addEventListener("load", init)
