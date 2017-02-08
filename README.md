# Simple L-System
A very basic and futile attempt at doing a tree generator.

## Details

* The internal LSystem generator, expander and evaluator is somewhat generic and can be easily extended. It is essentially a doubly linked list with some pattern matching. A distinction is made between expanding and evaluating a system, however.
* There are three examples of different grammars and their rules. Details can be found in the code, specifically in plants.js
* Most of the work went into generating the tree mesh, which currently has some problems, and tweaking the instructions, as always is with procedural content.
* The branches use an elaborate formula to define the cross section. This is useful to do complicated surfaces, such as a cactus (shown in the demo). Certain instructions can change the parameters to this formula, so these changes can be seen in the same tree (The anemone looking tree shows this)
* Interesting instructions are the root symbols, which simulate the growing branches going into the floor, and cactus branches, which tend to go upwards and stop rotating.
* It uses random-js and a mersenne twister to assure reproducibility, but seeds are regenerated when the user desires.
