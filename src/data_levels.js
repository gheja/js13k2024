const LEVELS = [
    /*
    [ 
        0: level step interval min,
        1: level step interval max,
        2: start speed,
        3: end speed,
        4: random seed, 
        5: [ intro texts ], 
        6: [ outro texts ],
        7: [ enemy1 chances ],
        8: [ enemy1 goal counts ],
        9: [ group chances ]
    ]
    */

    [ 20, 40, 40, 80, 961, [ "Catch three ghosts!"], [ "Congrats!" ], [ 1, 0, 0, 0, 0, 0 ], [ 3, 0, 0, 0, 0, 0 ], [ 1, 0, 0, 0 ] ],
    [ 5, 20, 80, 80, 123, [ "Catch 15 ghosts!"], [ "Congrats!" ], [ 1, 0, 0, 0, 0, 0 ], [ 15, 0, 0, 0, 0, 0 ], [ 1, 0, 0, 0 ] ]
]
