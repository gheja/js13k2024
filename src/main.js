"use strict";

let _d
let root;
let bg;
let _sprites;
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
	root = document.getElementById("g")
	bg = document.getElementById("b")
	bg.style.background = "url(" + GFX_BACKGROUND + ")"
	bg.style.backgroundSize = "30%"
	gameInit()
}

window.addEventListener("load", init)
