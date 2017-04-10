
Hannah Bollar
hbollar

The objective of this assignment is to create an L System parser and generate interesting looking plants. 

## View the Project

# [Click Here](https://hanbollar.github.io/Project3-LSystems/)

## My Implementation of the Assignment

Invented operations for any three symbols of choosing:
-  'A', 'B' : different rotations for y,z rotations bc + and - covered base-x rotations
-  'C' : adding a flower to the tree (sphere)

Interactive variables:

-  the base axiom: what it builds off of when it starts the first iteration [or redraws for a new set of iterations]
   note: only builds off of this only when iterations changes from <= current iterations. otherwise builds off of current axiom so the tree "grows".
-  r, g, b: changes rgb values of the actuall tree/plant. flowers change based on this inputted color but are not the exact color inputted

L-System Plants

-  grows in 3D as explained in the base axiom interactive variable: 
   builds off of base axiom only when iterations changes from <= current iterations. otherwise builds off of current axiom so the tree "grows".
-  has flowers that are added as part of grammar
-  different instances of the plant look distinctly different
-  twist: the color of the flowers changes with reference to the color of the tree itself

## Images

Depiction of a tree outcome:
![The Tree](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/1_tree.png "The tree")

Rotation of the current tree outcome:
![Rot of Tree](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/2_tree_rot.png "Rot of Tree")

Depicting RGB change:
![RGB Change 1](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/3_color_rgb.png "RGB Change 1")
![RGB Change 2](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/4_color_rgb2.png "RGB Change 2")

Clearer depiction of flowers color change:
![Flowers Color Change](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/5_color_rgb2_ballschange2.png "TFlowers Color Change")

Iterations Changed to a Greater Amount: Tree Grows
![Increase in Iterations](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/6_treegrowsPosIterations.png "Increase in Iterations")

Iterations Changed to a Less than or Equal to Current Amount: Rebuild Tree from Beginning Axiom
![Rebuild Tree](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/7_newtreeSameFewerIterations.png "Rebuild Tree")

Change Tree Base Axiom:
![Base Axiom Altered](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/8_changeBaseAxiom.png "Base Axiom Altered")

Change which Tree Type being Built: Type 1
![Different tree 1](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/9_changeWhichTreeUsing.png "Different Tree 1")

Change which Tree Type being Built: Type 2
![Different tree 2](https://github.com/hanbollar/Project3-LSystems/blob/a01f96d554d9855dc85437d73221f360bcf4d999/photos/10_changeWhichTreeUsing_2.png "Different tree 2")