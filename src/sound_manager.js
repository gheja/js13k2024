"use strict";

function soundLoopWarning()
{
    if (_oofActive)
    {
        zzfx(...SOUNDS[2])
    }
}

function soundLoopBeam()
{
    if (_state == STATE_RUNNING && !_dialogOpen)
    {
        zzfx(...SOUNDS[0])
    }
}

function soundManagerInit()
{
    window.setInterval(soundLoopWarning, 600)
    window.setInterval(soundLoopBeam, 500)
}
