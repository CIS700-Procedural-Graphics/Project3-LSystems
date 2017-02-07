const THREE = require('three')

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
  
export default class Turtle {
    
    constructor(scene, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
        this.scene = scene;
        this.savedStates = [];
        this.angle = 30.0;
        this.iterations = 0;
        //this.angle = 30.0;

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 1.0, 0, 0),
                '-' : this.rotateTurtle.bind(this, -1.0, 0, 0),
                'U' : this.rotateTurtle.bind(this, 0.0, 0, 1.0),
                'V' : this.rotateTurtle.bind(this, 0.0, 0, -1.0),
                'J' : this.rotateTurtle.bind(this, 0.0, 1.0, 0),
                'K' : this.rotateTurtle.bind(this, 0.0, -1.0, 0.0),
                'F' : this.makeCylinder.bind(this, 2, 0.05),
                '[' : this.storeState.bind(this),
                ']' : this.restoreState.bind(this)
            };
        } else {
            this.renderGrammar = grammar;
        }
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
    rotateTurtle(x, y, z) {

        // if(x > 0){
        //     x = this.angle;
        // }else{
        //     x = -this.angle;
        // }
        var e = new THREE.Euler(
                x * this.angle * 3.14/180,
				y * this.angle * 3.14/180,
				z * this.angle * 3.14/180);
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
        var geometry = new THREE.CylinderGeometry(width, width, len);

        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);

        var treeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCylY: {value: trans.y},
                uIters: {value: this.iterations}
            },
            vertexShader: require('./shaders/tree-vert.glsl'),
            fragmentShader: require('./shaders/tree-frag.glsl')
        });
        var material = new THREE.MeshBasicMaterial( {color: 0x00cccc} );
        var cylinder = new THREE.Mesh( geometry, treeMaterial );
        this.scene.add( cylinder );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        cylinder.applyMatrix(mat5);

        //Scoot the turtle forward by len units
        this.moveForward(len/2);
    };
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
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

    storeState(){
        this.savedStates.push(new TurtleState(this.state.pos, this.state.dir));
        // console.log("SAVED");
        // console.log(this.state.pos);
    };

    restoreState(){
        this.state = this.savedStates.pop();
        // console.log("RESTORED");
        // console.log(this.state.pos);
    };

    updateAngle(newAngle){
        this.angle = newAngle;
    }
}