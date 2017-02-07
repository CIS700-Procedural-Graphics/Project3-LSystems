# L-System Parser

lsystem.js contains classes for L-system, Rule, and LinkedList.

**The Symbol Nodes/Linked List:**

The L-System Axiom, Grammar strings are represented as linked lists nodes. This helps when iterating through the linked list to replace with the appropriate replacement rule string. The Linked List structure is opted as Javascript re-creates a new string each time a copy or an append is to be made to the string.

**Rules:**

These are containers for the preconditions, postconditions and probability of a single replacement operation. They operate on a symbol node in your linked list.

The rules are selected on a probablity bases which is changable in the UI. Each symbol is changed during the parsing state based on the probablity of choosing the Rule to replace it with. The probablity is stored along with each rule and during execution a random number is generated to either apply or reject the symbol-rule swapping. 

**L-system:**

This is the parser, which loops through the linked list of symbol nodes and apply rules at each iteration.

tThe following functions are implemented in the L-System so that you one can apply grammar rules to the axiom given some number of iterations.

- `stringToLinkedList(input_string)`
- `linkedListToString(linkedList)`
- `replaceNode(linkedList, node, grammar, iterations)`
- `doIterations(num)`

## Turtle

`turtle.js` has a function called renderSymbol that takes in a single node of a linked list and performs an operation to change the turtle’s state based on the symbol contained in the node. Usually, the turtle’s change in state will result in some sort of rendering output, such as drawing a cylinder when the turtle moves forward. We have provided you with a few example functions to illustrate how to write your own functions to be called by renderSymbol; these functions are rotateTurtle, moveTurtle, moveForward, and makeCylinder. If you inspect the constructor of the Turtle class, you can see how to associate an operation with a grammar symbol.

- Modify turtle.js to support operations associated with the symbols `[` and `]`
    - When you parse `[` you need to store the current turtle state somewhere
    - When you parse `]` you need to set your turtle’s state to the most recently stored state. Think of this a pushing and popping turtle states on and off a stack. For example, given `F[+F][-F]`, the turtle should draw a Y shape. Note that your program must be capable of storing many turtle states at once in a stack.

- In addition to operations for `[` and `]`, you must invent operations for any three symbols of your choosing.

## Symbols

F- moves forward creating a cylinder
X- rotate turtle along Y-axis 90 degrees
A- include a fruit object in the scene (work in progress)


## Interactivity

Using dat.GUI and the examples provided in the reference code, make some aspect of your demo an interactive variable. For example, you could modify:

1. the axiom
2. Your input grammer rules and their probability
3. the angle of rotation of the turtle
4. the size or color or material of the cylinder the turtle draws, etc!

## L-System Plants

Design a grammar for a new procedural plant! As the preceding parts of this assignment are basic computer science tasks, this is where you should spend the bulk of your time on this assignment. Come up with new grammar rules and include screenshots of your plants in your README. For inspiration, take a look at Example 7: Fractal Plant in Wikipedia: https://en.wikipedia.org/wiki/L-system Your procedural plant must have the following features

1. Grow in 3D. Take advantage of three.js! 
2. Have flowers or leaves that are added as a part of the grammar
3. Variation. Different instances of your plant should look distinctly different!
4. A twist. Broccoli trees are cool and all, but we hope to see sometime a little more surprising in your grammars

# Publishing Your code

Running `npm run deploy` will automatically build your project and push it to gh-pages where it will be visible at `username.github.io/repo-name`. NOTE: You MUST commit AND push all changes to your MASTER branch before doing this or you may lose your work. The `git` command must also be available in your terminal or command prompt. If you're using Windows, it's a good idea to use Git Bash.