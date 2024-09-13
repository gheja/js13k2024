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

    [ 20, 40, 40, 80, 961, [ "", "Catch three ghosts!" ], [ "Nice job!" ], [ 1, 0, 0, 0, 0, 0 ], [ 3, 0, 0, 0, 0, 0 ], [ 3, 1, 0, 0 ] ],
    [ 8, 25, 40, 80, 432, [ "Let's catch some more ghosts! But uh-oh...", "It looks like your storage unit is a bit funky.", "It can't hold exactly 13 ghosts of a kind...", "Or 13 ghosts in total...", "Or any multiplies of 13, so...", "Good luck!" ], [ "Phew, great job! I knew you could do it!" ], [ 1, 0, 0, 0, 0, 0 ], [ 15, 0, 0, 0, 0, 0 ], [ 3, 1, 0, 0 ] ],
    [ 8, 20, 60, 120, 123, [ "Oh and beware of the multiplies of 13, too...", "Catch them!" ], [ "Great!" ], [ 5, 3, 0, 0, 0, 0 ], [ 18, 12, 0, 0, 0, 0 ], [ 3, 1, 0, 0 ] ],
    [ 6, 25, 60, 120, 112, [ "You know the drill.", ], [ "Great!" ], [ 20, 15, 5, 2, 0, 0 ], [ 25, 20, 2, 1, 0, 0 ], [ 10, 2, 1, 0 ] ],
]
