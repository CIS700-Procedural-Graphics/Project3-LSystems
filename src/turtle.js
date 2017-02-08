const THREE = require('three')

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos, forward, up, left) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        forward : new THREE.Vector3(forward.x, forward.y, forward.z),
        up : new THREE.Vector3(up.x, up.y, up.z),
        left : new THREE.Vector3(left.x, left.y, left.z)
    }
}
  
export default class Turtle {
    
    constructor(scene, totaldepth, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1), new THREE.Vector3(-1,0,0));
        this.scene = scene;
        this.stack = [];
        this.depth = 1;
        this.totaldepth = totaldepth;

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 0, 0, 50),
                '-' : this.rotateTurtle.bind(this, 0, 0, -50),
                '&' : this.rotateTurtle.bind(this, 72, 0, 0),
                '^' : this.rotateTurtle.bind(this, 90, 0, 0),
                'F' : this.makeCylinder.bind(this, 2, 0.1),
                'X' : this.makeCylinder.bind(this, 2, 0.1),
                'S' : this.makeSphere.bind(this, 2),
                '[' : this.pushState.bind(this),
                ']' : this.popState.bind(this)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1), new THREE.Vector3(-1,0,0));        
    }

    pushState() {
        //make sure this is NEW TurtleState or else this state is never saved into heap
        //also make sure to use NEW THREE.Vector3
        //and use this.state.pos, do not take in an argument into this function, will cause delay
        var newState = new TurtleState(new THREE.Vector3(this.state.pos.x, this.state.pos.y, this.state.pos.z), 
            new THREE.Vector3(this.state.forward.x, this.state.forward.y, this.state.forward.z),
            new THREE.Vector3(this.state.up.x, this.state.up.y, this.state.up.z),
            new THREE.Vector3(this.state.left.x, this.state.left.y, this.state.left.z));
        this.stack.push(newState);
    }

    popState() {
        this.state = this.stack.pop();
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos);
        //console.log(this.state.dir)
    }

    // Rotate the turtle's _dir_ vector by each of the 
    // Euler angles indicated by the input.
    rotateTurtle(forwardA, upA, leftA) {

        /*
        var e = new THREE.Euler(
                leftA * Math.PI/180,
                upA * Math.PI/180,
                forwardA * Math.PI/180);
        this.state.forward.applyEuler(e);
        this.state.up.applyEuler(e);
        this.state.left.applyEuler(e);
        */

        var q = new THREE.Quaternion();
        if (forwardA > 0) {
            q.setFromAxisAngle(this.state.forward, forwardA * Math.PI/180.0);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(q);
            this.state.up.applyMatrix4(mat4);
            this.state.left.applyMatrix4(mat4);
        }

        if (upA > 0) {
            q.setFromAxisAngle(this.state.up, upA * Math.PI/180.0);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(q);
            this.state.forward.applyMatrix4(mat4);
            this.state.left.applyMatrix4(mat4);
        }

        if (leftA > 0) {
            q.setFromAxisAngle(this.state.left, leftA * Math.PI/180.0);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(q);
            this.state.forward.applyMatrix4(mat4);
            this.state.up.applyMatrix4(mat4);
        }

        /*
        var e = new THREE.Euler(
                x * 3.14/180,
				y * 3.14/180,
				z * 3.14/180);
        this.state.dir.applyEuler(e);
        */
    }

    /*
    // Translate the turtle along the input vector.
    // Does NOT change the turtle's _dir_ vector
    moveTurtle(x, y, z) {
	    var new_vec = THREE.Vector3(x, y, z);
	    this.state.pos.add(new_vec);
    };
    */

    // Translate the turtle along its _dir_ vector by the distance indicated
    moveForward(dist) {
        var newVec = this.state.forward.multiplyScalar(dist);
        this.state.pos.add(newVec);
    };
    
    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeCylinder(len, width) {
        var geometry = new THREE.CylinderGeometry(this.totaldepth*0.25/this.depth, this.totaldepth*0.25/this.depth, len);
        var material = new THREE.MeshLambertMaterial( {color: 0xB8753E} );
        var cylinder = new THREE.Mesh( geometry, material );
        this.scene.add( cylinder );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.forward);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        cylinder.applyMatrix(mat4);


        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.forward.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        //Scoot the turtle forward by len units
        this.moveForward(len/2);
    };

    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeSphere(radius) {
        if (this.totaldepth - this.depth <= 0) {
            var len = this.totaldepth*1/this.depth;
            var geometry = new THREE.IcosahedronGeometry( len, 1);
            var material = new THREE.MeshLambertMaterial( {color: 0xA5C33F} );
            var cylinder = new THREE.Mesh( geometry, material );
            this.scene.add( cylinder );

            //Orient the cylinder to the turtle's current direction
            var quat = new THREE.Quaternion();
            quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.forward);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(quat);
            cylinder.applyMatrix(mat4);


            //Move the cylinder so its base rests at the turtle's current position
            var mat5 = new THREE.Matrix4();
            var trans = this.state.pos.add(this.state.forward.multiplyScalar(0.5 * len));
            mat5.makeTranslation(trans.x, trans.y, trans.z);
            cylinder.applyMatrix(mat5);

            //Scoot the turtle forward by len units
            this.moveForward(len/2);
        }
    };
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        var func = this.renderGrammar[symbolNode.symbol];
        this.depth = this.stack.length+1;
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