

# L-System Parser and Turtle Renderer
This is an implementation of an L-System parser and a turtle renderer that allows the user to create different variations of a blue flowered tree. 

The L-System is represented by a linked list which allows the system to replace characters in the system in constant time. The turtle renderer calls several different functions to visually represent the final grammar after a few iterations. 

I created new rules in my turtle renderer that allowed turns in the xyz dimension. I stored the number of iterations as a property of the nodes of the linked list so that I can see where to render the flowers (I did them with a certain probability as well as ensuring the flowers only rendered after the 1st iteration so the tree looks more natural). I also used the number of iterations to vary the width of the tree along the height. The further up the branches get, the thinner the branches get. 

The flower is an Lotus obj that was downloaded from TurboSquid.

The grammar rules have a certain probability associated with turns in each dimension. This creates variation between different instances of the same tree with the same number of iterations. You can check my implementation for the certain grammar I used. 

The user can also change the angle of the turns from branch to branch. 
![](https://raw.githubusercontent.com/emily-vo/Project3-LSystems/master/1.png)
![](https://raw.githubusercontent.com/emily-vo/Project3-LSystems/master/2.png)
![](https://raw.githubusercontent.com/emily-vo/Project3-LSystems/master/3.png)