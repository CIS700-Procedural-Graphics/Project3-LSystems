const THREE = require('three')

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
var TurtleState = function(pos, forward, up, left) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        forward : new THREE.Vector3(forward.x, forward.y, forward.z),
        up : new THREE.Vector3(up.x, up.y, up.z),
        left : new THREE.Vector3(left.x, left.y, left.z)
    }
}
  
export default class Turtle {
    
    constructor(scene, totaldepth, anglefactor) {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), new THREE.Vector3(0,0,1), new THREE.Vector3(-1,0,0));
        this.scene = scene;
        this.stack = [];
        this.depth = 1;
        this.totaldepth = totaldepth+1;
        this.anglefactor = anglefactor;
        this.allMeshes = new Set();
        this.mergeBranches = new THREE.Geometry();
        this.mergeLeaves = new THREE.Geometry();
        this.branches = new THREE.Mesh(this.mergeBranches, new THREE.MeshStandardMaterial({color: 0xCD853F, shading: THREE.FlatShading, roughness: 1, metalness: 0}) );
        this.leaves = new THREE.Mesh(this.mergeLeaves, new THREE.MeshStandardMaterial( {color: 0xADFF2F, shading: THREE.FlatShading, roughness: 1, metalness: 0} ) );
        
        scene.add(this.branches);
        scene.add(this.leaves);
        this.allMeshes.add(this.branches);
        this.allMeshes.add(this.leaves);
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

        var q = new THREE.Quaternion();
        if (forwardA != 0) {
            //forward rotation is not affected by angle factor, rotation about the trunk
            q.setFromAxisAngle(this.state.forward, forwardA * Math.PI/180.0);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(q);
            this.state.up.applyMatrix4(mat4);
            this.state.left.applyMatrix4(mat4);
        }

        if (upA != 0) {
            //up rotation is not affected by angle factor, main trunk curve
            q.setFromAxisAngle(this.state.up, upA * Math.PI/180.0);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(q);
            this.state.forward.applyMatrix4(mat4);
            this.state.left.applyMatrix4(mat4);
        }

        if (leftA != 0) {
            q.setFromAxisAngle(this.state.left, this.anglefactor*leftA * Math.PI/180.0);
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
        var geometry = new THREE.CylinderGeometry(this.totaldepth*0.25/this.depth, this.totaldepth*0.25/this.depth, len, 6);
        //var material = new THREE.MeshStandardMaterial( {color: 0xCD853F, shading: THREE.FlatShading, roughness: 1, metalness: 0} );
        //var cylinder = new THREE.Mesh( geometry, material );

        //Orient the cylinder to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.forward);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        //geometry.applyMatrix(mat4);

        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.forward.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        //geometry.applyMatrix(mat5);

        //this.scene.add(cylinder);
        //this.allMeshes.add(cylinder);
        this.mergeBranches.merge(geometry, new THREE.Matrix4().premultiply(mat4).premultiply(mat5));

        //Scoot the turtle forward by len units
        this.moveForward(len/2);
    };

    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeBrightSphere(radius) {
        if (this.totaldepth - this.depth <= 0) {

            var len = this.totaldepth*1.0/this.depth;
            var geometry = new THREE.IcosahedronGeometry(len, 0);
            //var material = new THREE.MeshStandardMaterial( {color: 0xADFF2F, shading: THREE.FlatShading, roughness: 1, metalness: 0} );
            //var sphere = new THREE.Mesh( geometry, material );

            //Orient the cylinder to the turtle's current direction
            var quat = new THREE.Quaternion();
            quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.forward);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(quat);
            //geometry.applyMatrix(mat4);

            //Move the cylinder so its base rests at the turtle's current position
            var mat5 = new THREE.Matrix4();
            var trans = this.state.pos.add(this.state.forward.multiplyScalar(0.5 * len));
            mat5.makeTranslation(trans.x, trans.y, trans.z);
            //geometry.applyMatrix(mat5);

            //this.scene.add(sphere);
            //this.allMeshes.add(sphere);
            this.mergeLeaves.merge(geometry, new THREE.Matrix4().premultiply(mat4).premultiply(mat5));

            //Scoot the turtle forward by len units
            this.moveForward(len/2);
        }
    };

    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeDarkSphere(radius) {
        if (this.totaldepth - this.depth <= 0) {
            var len = this.totaldepth*1.0/this.depth;
            var geometry = new THREE.IcosahedronGeometry(len, 0);
            //var material = new THREE.MeshStandardMaterial( {color: 0xADFF2F, shading: THREE.FlatShading, roughness: 1, metalness: 0} );
            //var sphere = new THREE.Mesh( geometry, material );

            //Orient the cylinder to the turtle's current direction
            var quat = new THREE.Quaternion();
            quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.forward);
            var mat4 = new THREE.Matrix4();
            mat4.makeRotationFromQuaternion(quat);
            //geometry.applyMatrix(mat4);

            //Move the cylinder so its base rests at the turtle's current position
            var mat5 = new THREE.Matrix4();
            var trans = this.state.pos.add(this.state.forward.multiplyScalar(0.5 * len));
            mat5.makeTranslation(trans.x, trans.y, trans.z);
            //geometry.applyMatrix(mat5);

            //this.scene.add(sphere);
            //this.allMeshes.add(sphere);
            this.mergeLeaves.merge(geometry, new THREE.Matrix4().premultiply(mat4).premultiply(mat5));

            //Scoot the turtle forward by len units
            this.moveForward(len/2);
        }
    };

    // converts grammar symbols to functions
    renderSymbol(symbolNode) {
        switch(symbolNode.symbol) {
            case '+': this.rotateTurtle(0, 0, 40); break;
            case '-': this.rotateTurtle(0, 0, -40); break;
            case '&': this.rotateTurtle(72, 0, 0); break;
            case '$': this.rotateTurtle(0, 30, 0); break;
            case '%': this.rotateTurtle(0, -30, 0); break;
            case 'F': this.makeCylinder(2, 0.1); break;
            case 'X': this.makeCylinder(2, 0.1); break;
            case 'A': this.makeCylinder(2, 0.1); break;
            case 'S': this.makeBrightSphere(2); break;
            case 'D': this.makeDarkSphere(2); break;
            case '[': this.pushState(); this.depth++; break;
            case ']': this.popState(); this.depth--; break;
            default: break;
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