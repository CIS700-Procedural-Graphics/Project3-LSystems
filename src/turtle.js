const THREE = require('three')
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

var flowerGeoOne;
var flowerGeoTwo;
var flowerGeoFour;

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos, dir) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        dir: new THREE.Vector3(dir.x, dir.y, dir.z)
    }
}

function LinkedList(first, last)
{
    this.firstNode = first;
    this.lastNode = last;
}

class Node {

  constructor(state, next, prev) 
  {
    // if we want to access these later, we need to bind them to 'this'
    this.next = next;
    this.prev = prev;
    this.state = state;
  }

  getNext() 
  {
    return this.next;
  }

  getPrev() 
  {
    return this.prev;
  }

  getState() 
  {
    return this.state;
  }

  setNext(newNext) 
  {
    this.next = newNext;
    newNext.prev = this;
  }

}

function loadFlower()
{
    // load a simple obj mesh
        var objLoader = new THREE.OBJLoader();
        objLoader.load('flowerPetal.obj', function(obj){

            // LOOK: This function runs after the obj has finished loading
            flowerGeoOne =  obj.children[0].geometry;
            flowerGeoOne.scale(0.2, 0.1, 0.2);
        });
        objLoader.load('twoPetals.obj', function(obj){

            // LOOK: This function runs after the obj has finished loading
            flowerGeoTwo =  obj.children[0].geometry;
            flowerGeoTwo.scale(0.2, 0.1, 0.2);
        });
        objLoader.load('fourPetals.obj', function(obj){

            // LOOK: This function runs after the obj has finished loading
            flowerGeoFour =  obj.children[0].geometry;
            flowerGeoFour.scale(0.2, 0.1, 0.2);
        });
}
  
export default class Turtle {
    
    constructor(scene, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,-5,0), new THREE.Vector3(0,1,0));
        this.scene = scene;
        this.angle = 30.0;
        this.height = 2;
        this.width = 0.1;
        this.stateStack = new LinkedList(null, null);
        this.currIter = 1;
        this.nextIter = 1;
        
        this.flowerGeo = loadFlower();

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, this.angle, 0, 0),
                '-' : this.rotateTurtle.bind(this, -this.angle, 0, 0),
                'F' : this.makeCylinder.bind(this, this.height, this.width, this.currIter, this.nextIter),
                '[' : this.startNewState.bind(this, this.stateStack),
                ']' : this.endThisState.bind(this, this.stateStack),
                '<' : this.rotateTurtle.bind(this, 0, this.angle, 0),
                '>' : this.rotateTurtle.bind(this, 0, -this.angle, 0),
                'C' : this.makeFlower.bind(this),
                'P' : this.makeCone.bind(this, this.height, this.width, this.currIter),
                'T' : this.makeTrunk.bind(this, this.height, this.width, this.currIter)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
        this.stateStack.firstNode = null;
        this.stateStack.lastNode = null;        
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos)
        console.log(this.state.dir)
    }

    // Rotate the turtle's _dir_ vector by each of the 
    // Euler angles indicated by the input.
    rotateTurtle(x, y, z) {
        var e = new THREE.Euler(
                x * 3.14/180,
				y * 3.14/180,
				z * 3.14/180);
        this.state.dir.applyEuler(e);
    }

    // Translate the turtle along the input vector.
    // Does NOT change the turtle's _dir_ vector
    moveTurtle(x, y, z) {
	    var new_vec = THREE.Vector3(x, y, z);
	    this.state.pos.add(new_vec);
    };

    // Translate the turtle along its _dir_ vector by the distance indicated
    moveForward(dist) {
        var newVec = this.state.dir.multiplyScalar(dist);
        this.state.pos.add(newVec);
    };
    
    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeCylinder(len, width, iter, nextIter) {
        var geometry = new THREE.CylinderGeometry(this.width*(this.nextIter+1), this.width*(this.currIter+1), this.height);
        var material = new THREE.MeshLambertMaterial( { color: 0x9e796b, side: THREE.DoubleSide });
        var cylinder = new THREE.Mesh( geometry, material );
        this.scene.add( cylinder );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * this.height));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        //Scoot the turtle forward by len units
        this.moveForward(this.height/2);
    };

    makeCone(len, width, iter) {
        var geometry = new THREE.ConeGeometry(this.width*(this.currIter+1), this.height, 12);
        var material = new THREE.MeshLambertMaterial( { color: 0x9e796b, side: THREE.DoubleSide });
        var cylinder = new THREE.Mesh( geometry, material );
        this.scene.add( cylinder );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * this.height));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        //Scoot the turtle forward by len units
        this.moveForward(this.height/2);
    };

    makeFlower(len) {
        var material = new THREE.MeshLambertMaterial( { color: 0xf272ba, side: THREE.DoubleSide});

        var flowerColor = new THREE.ShaderMaterial({
            uniforms: {
                petalPivot: { 
                    value: this.state.pos
                },
            },
            //using my own shaders to create white pink gradient
            vertexShader: require('./shaders/flower-vert.glsl'),
            fragmentShader: require('./shaders/flower-frag.glsl')
        });

        var flower;
        var rando = Math.floor(Math.random() * 3 + 1); //number of petals on this flower, between 1 and 6

        if(rando == 1)
        {
            flower = new THREE.Mesh( flowerGeoOne, flowerColor );
        }
        else if(rando == 2)
        {
            flower = new THREE.Mesh( flowerGeoTwo, flowerColor );
        }
        else
        {
            flower = new THREE.Mesh( flowerGeoFour, flowerColor );
        }
        flower.castShadow = true;
        flower.receiveShadow = true;
        this.scene.add( flower );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        flower.applyMatrix(mat4);

        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos;//.add(this.state.dir.multiplyScalar(0.5 * this.height));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        flower.applyMatrix(mat5);
    };

    makeTrunk(len, width, iter) {
        var geometry = new THREE.CylinderGeometry(this.width*(this.nextIter+1), this.width*(3*this.currIter+1), this.height+this.currIter);
        var material = new THREE.MeshLambertMaterial( { color: 0x9e796b, side: THREE.DoubleSide });

        var cylinder = new THREE.Mesh( geometry, material );
        this.scene.add( cylinder );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * this.height));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        this.moveForward(this.height/2);
    };

    startNewState(stack) {
        var currState = new TurtleState(this.state.pos, this.state.dir);
        var newNode = new Node(currState, null, null);
        if(stack.lastNode == null)
        {
            stack.firstNode = newNode;
            stack.lastNode = newNode;
        }
        else
        {
            stack.lastNode.setNext(newNode);
            stack.lastNode = newNode;
        }
    };

    endThisState(stack) {
        this.state = stack.lastNode.state;
        if(stack.lastNode.prev == null)
        {
            stack.firstNode = null;
            stack.lastNode = null;
        } 
        else
        {
            stack.lastNode = stack.lastNode.prev;
        }
    };
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        var func = this.renderGrammar[symbolNode.symbol];
        this.currIter = symbolNode.num;
        if(symbolNode.next != null)
        {
            this.nextIter = symbolNode.next.num;
        }      
        if (func) {
            func();
        }
    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(linkedList) {
        var currentNode;
        for(currentNode = linkedList.firstNode; currentNode != null; currentNode = currentNode.next) {
            this.renderSymbol(currentNode);
        }
    }

    updateHeight(newVal){
        this.height = newVal;
    }

    updateWidth(newVal){
        this.width = newVal;
    }
}