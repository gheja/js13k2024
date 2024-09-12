"use strict"

let _randomSeed = 0

function getRandomFloat()
{
    _randomSeed = (_randomSeed * 26031 + 35803270) % 5886503

    return (_randomSeed % 73727) / 73727;
}

function getRandomInt(min, max)
{
    return (getRandomFloat() * (max - min) + min) | 0;
}

function getRandomPick(arr)
{
    return arr[getRandomInt(0, arr.length)]
}
