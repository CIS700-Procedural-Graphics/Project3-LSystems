const THREE = require('three')


var material = new THREE.MeshBasicMaterial( {color: 0x00cccc} );
var geometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 8);

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// pos: position in world space
// dir: local y axis
// lx: local x axis
// lz: local z axis
var TurtleState = function(pos, dir, lx, lz) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        dir: new THREE.Vector3(dir.x, dir.y, dir.z),
        lx: new THREE.Vector3(lx.x, lx.y, lx.z),
        lz: new THREE.Vector3(lz.x, lz.y, lz.z)
    }
}
  
export default class Turtle {
    
    constructor(scene, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 
            new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,1));
        this.scene = scene;
        // an array of Turtlestates saved in a stack
        this.stateStack = [];

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 30, 0, 0),
                '-' : this.rotateTurtle.bind(this, -30, 0, 0),
                '<' : this.rotateTurtle.bind(this, 0, 30, 0),
                '>' : this.rotateTurtle.bind(this, 0, -30, 0),
                'l' : this.rotateTurtle.bind(this, 0, 0, 30),
                'r' : this.rotateTurtle.bind(this, 0, 0, -30),
                'F' : this.makeCylinder.bind(this, 1.0, 1.0),
                'G' : this.makeCylinder.bind(this, 1.0, 1.0),
                '[' : this.saveTurtle.bind(this),
                ']' : this.loadTurtle.bind(this)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 
            new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,1));
        this.stateStack = [];        
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
        
        // rotate using global euler functions
        var e = new THREE.Euler(
                x * 3.14/180,
				y * 3.14/180,
				z * 3.14/180);
        //this.state.dir.applyEuler(e);


        // rotate about local axis
        // local yaw
        this.state.lx.applyAxisAngle(this.state.dir, y * 3.14159 / 180);
        this.state.lz.applyAxisAngle(this.state.dir, y * 3.14159 / 180);
        // local pitch
        this.state.dir.applyAxisAngle(this.state.lx, x * 3.14159 / 180);
        this.state.lz.applyAxisAngle(this.state.lx, x * 3.14159 / 180);
        //local roll
        this.state.dir.applyAxisAngle(this.state.lz, z * 3.14159 / 180);
        this.state.lx.applyAxisAngle(this.state.lz, z * 3.14159 / 180);

    }

    // Translate the turtle along the input vector.
    // Does NOT change the turtle's _dir_ vector
    moveTurtle(x, y, z) {
	    var new_vec = THREE.Vector3(x, y, z);
	    this.state.pos.add(new_vec);
    };

    // saves the state of the turtle on the stack
    saveTurtle() {
        
        var aState = new TurtleState(this.state.pos, this.state.dir, 
            this.state.lx, this.state.lz);
        this.stateStack.push(aState);
    };

    // pops the state of the turtle off of the stack, if able
    loadTurtle() {
        
        if (this.stateStack.length > 0) {
            var aState = this.stateStack.pop();
            this.state.pos = aState.pos;
            this.state.dir = aState.dir;
            this.state.lx = aState.lx;
            this.state.lz = aState.lz;
        }
    };

    // Translate the turtle along its _dir_ vector by the distance indicated
    moveForward(dist) {
        var newVec = this.state.dir.multiplyScalar(dist);
        this.state.pos.add(newVec);
    };
    
    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeCylinder(scaleRad, scaleLen) {
        
        
        var cylinder = new THREE.Mesh( geometry, material );
        cylinder.scale.set(scaleRad, scaleLen, scaleRad);
        this.scene.add( cylinder );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * 2.0 * scaleLen));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        //Scoot the turtle forward by len units
        this.moveForward(2.0 * scaleLen/2);
    };
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        //console.log(symbolNode);
        var func = this.renderGrammar[symbolNode.symbol];
        if (func) {
            func();
        }
    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(linkedList) {
        var currentNode;
        for(currentNode = linkedList.head; currentNode != null; currentNode = currentNode.next) {
            this.renderSymbol(currentNode);
        }
    }
}