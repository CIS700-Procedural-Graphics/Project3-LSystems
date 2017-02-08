# L-Systems

https://davlia.github.io/Project3-LSystems/

![]('lol.png')

## Grammar
 - `+` : Rotate turtle x 30 degrees
 - `-` : Rotate turtle x 30 degrees
 - `,` : Rotate turtle y 30 degrees
 - `.` : Rotate turtle y 30 degrees
 - `<` : Rotate turtle z 30 degrees
 - `>` : Rotate turtle z 30 degrees
 - `F` : Make cylinder
 - `L` : Make a leaf (not too interesting)
 - `W` : Make a very interesting leaf
 - `D` : Make some very beautiful flowers
 - `R` : Add red color to the palette
 - `r` : Subtract red color from the palette
 - `G` : Add green color to the palette
 - `g` : Subtract green color from the palette
 - `B` : Add blue color to the palette
 - `b` : Subtract blue color from the palette
 - `%` : Increase the turtle size
 - `$` : Decrease the turtle size
 - `V` : Increase the turtle width
 - `v` : Decrease the turtle width
 - `[` : Save state
 - `]` : Restore state

## State saving
The turtle state contains the position, direction, color, and size. Using `[` and `]` will perform a push and a pop from the state stack respectively.

## Grammar input
The grammar input box is new line separated and follows the following pattern:

`Symbol`, `Probability` => `Successor symbols`

Note that the probabilities do not have to sum to one. They are normalized internally.
