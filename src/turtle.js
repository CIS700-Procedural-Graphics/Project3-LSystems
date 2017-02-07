const THREE = require('three')

var objLoader = new THREE.OBJLoader();
var flowGeometry;
objLoader.load('lotus_OBJ_low.obj', function(obj) {

    // LOOK: This function runs after the obj has finished loading
    flowGeometry = obj.children[0].geometry;
});

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos, dir) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        dir: new THREE.Vector3(dir.x, dir.y, dir.z), 
    }
}
  
export default class Turtle {
    constructor(scene, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,-5,-10), new THREE.Vector3(0,1,0));
        this.scene = scene;
        this.stack = [];
        this.angle = 15;
        this.iteration = 1;
        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 0, 0, 0, -1, 0, 0),
                '-' : this.rotateTurtle.bind(this, 0, 0, 0, 1, 0, 0),
                'F' : this.makeCylinder.bind(this, 2, 0.1), 
                '[' : this.saveState.bind(this), 
                ']' : this.restoreState.bind(this), 
                'Q' : this.rotateTurtle.bind(this, 0, 0, 0, 0, -1, 0),
                'W' : this.rotateTurtle.bind(this, 0, 0, 0, 0, 1, 0),
                'E' : this.rotateTurtle.bind(this, 0, 0, 0, 0, 0, -1),
                'R' : this.rotateTurtle.bind(this, 0, 0, 0, 0, 0, 1), 
                'A' : this.drawFlower.bind(this, 2, 0.1)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }
    drawFlower(len, width) {
        //var tmp_turtle = this;
        if (this.iteration > 0) {
            //this.scene.add(mesh);
//
            //var quat = new THREE.Quaternion();
            //quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
            //var mat4 = new THREE.Matrix4();
            //mat4.makeRotationFromQuaternion(quat);
            //mesh.applyMatrix(mat4);
//
            //var mat5 = new THREE.Matrix4();
            //var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
            //mat5.makeTranslation(trans.x, trans.y, trans.z);
            //mesh.applyMatrix(mat5);

            //this.moveForward(len/2);
        }
    }
    saveState() {
        var newPos = this.state.pos;
        var newDir = this.state.dir;
        var newState = new TurtleState(newPos, newDir);
        this.stack.push(newState);
    }
    restoreState() {
        this.state = this.stack.pop();
    }
    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));      
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos)
        console.log(this.state.dir)
    }

    // Rotate the turtle's _dir_ vector by each of the 
    // Euler angles indicated by the input.
    rotateTurtle(x, y, z, signx, signy, signz ) {
        var e = new THREE.Euler(
                signx*this.angle * 3.14/180,
				signy*this.angle * 3.14/180,
				signz*this.angle * 3.14/180);
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
    makeCylinder(len, width) {
        var geometry = new THREE.CylinderGeometry(1.5/this.iteration, 1.5/this.iteration, len);
        var material = new THREE.MeshLambertMaterial( {color: 0xba8964, side: THREE.DoubleSide} );
        var cylinder = new THREE.Mesh( geometry, material );
        var materialBlue = new THREE.MeshLambertMaterial({ color: 0x00ccff, side: THREE.DoubleSide });
        var mesh = new THREE.Mesh(flowGeometry, materialBlue);
        this.scene.add( cylinder );
        if (Math.random() < 0.25 && this.iteration > 1) {
           this.scene.add(mesh); 
        }
        
        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);
        mesh.applyMatrix(mat4);

        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);
        mesh.applyMatrix(mat5);
        //Scoot the turtle forward by len units
        this.moveForward(len/2);
    };
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        var func = this.renderGrammar[symbolNode.symbol];
        this.iteration = symbolNode.iteration;
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