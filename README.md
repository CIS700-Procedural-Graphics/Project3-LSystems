# L-System Parser

**The Symbol Nodes/Linked List:**

Rather than representing our symbols as a string like in many L-system implementations, we prefer to use a linked list. This allows us to store additional information about each symbol at time of parsing (e.g. what iteration was this symbol added in?) Since we’re adding and replacing symbols at each iteration, we also save on the overhead of creating and destroying strings, since linked lists of course make it easy to add and remove nodes.

**Rules:**

These are containers for the preconditions, postconditions and probability of a single replacement operation. They should operate on a symbol node in your linked list.

**L-system:**

This is the parser, which will loop through the linked list of symbol nodes and apply rules at each iteration.

## Turtle

`turtle.js` has a function called renderSymbol that takes in a single node of a linked list and performs an operation to change the turtle’s state based on the symbol contained in the node. Usually, the turtle’s change in state will result in some sort of rendering output, such as drawing a cylinder when the turtle moves forward.

## Interactivity

Following options are available in the GUI:
1. The axiom
2. Some input grammer rules and their probability
3. Iterations

## L-System Plants

The plants grow in 3D based on the grammar. Multiple rules can be applied for same symbols by slight modifications in the GUI (in main.js). The behavior on symbols can be changed in turtle.js

Deployed site:
https://rms13.github.io/Project3-LSystems/
