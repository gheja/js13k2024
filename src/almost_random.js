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

// arr is an array with the weights like [ 10, 10, 5, 5, 0, 0, 10 ]
// returns the index that was picked by the given chances/weights
// at least one item must be non-zero
function getRandomIndexWeighted(arr)
{
	var total = 0

	for (var a of arr)
	{
		total += a
	}

	var n = getRandomInt(0, total)

	for (var i = 0; i < arr.length; i++)
	{
		n -= arr[i]

		if (n < 0)
		{
			return i
		}
	}
}
