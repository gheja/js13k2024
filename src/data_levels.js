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
        9: [ group chances ],
        10: beam life time
    ]
    */

    [ 20, 40, 40, 80, 961, [ "Oh no, someone left the portal open. Quick, help me!", "First, catch three ghosts!" ], [ "Nice job!" ], [ 1, 0, 0, 0, 0, 0 ], [ 3, 0, 0, 0, 0, 0 ], [ 1, 0, 0, 0 ], 1.2 ],
    [ 12, 25, 40, 80, 432, [ "Let's catch some more! But uh-oh...", "It looks like your storage unit is a bit funky.", "It can't hold exactly 13 ghosts of a kind, so...", "Good luck!" ], [ "Phew, great job! I knew you could do it!" ], [ 1, 0, 0, 0, 0, 0 ], [ 15, 0, 0, 0, 0, 0 ], [ 4, 1, 0, 0 ], 1.0 ],
    [ 9, 20, 60, 100, 123, [ "Oh and beware of the multiplies of 13, too...", "Catch them!" ], [ "Great!" ], [ 5, 3, 0, 0, 0, 0 ], [ 18, 12, 0, 0, 0, 0 ], [ 3, 1, 0, 0 ], 1.0 ],
    [ 6, 25, 60, 100, 112, [ "You know the drill.", ], [ "Amazing!" ], [ 20, 15, 5, 2, 0, 0 ], [ 25, 20, 2, 1, 0, 0 ], [ 10, 2, 1, 0 ], 0.9 ],
    [ 6, 20, 70, 110, 371, [ "Oh no! The beam is getting weaker...", ], [ "Great job!", "Well, I think you caught enough of them.", "And this was all I got for the jam :)", "Thank you very much for playing!" ], [ 12, 9, 0, 1, 1, 0 ], [ 10, 10, 0, 3, 1, 0 ], [ 7, 2, 1, 0 ], 0.55 ],
]
