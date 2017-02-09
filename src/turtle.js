const THREE = require('three')


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
    
    constructor(scene, mesh, angle, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
        this.scene = scene;
        this.stack = [];
        this.mesh = mesh;
        this.angle = angle;
        this.dimen = 10; 
        this.geometries = []; 
        this.ruleArr = []; 

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                // large base cylinder
                'F' : this.makeCylinder.bind(this, 2, 0.15),

                // save state/return state
                '[' : this.saveState.bind(this),
                ']' : this.popState.bind(this),

                // small branch geometry
                'B' : this.makeSmallBranch.bind(this, 1.5, 0.05),
                'S' : this.rotateBase.bind(this),
                'D' : this.makeDivider.bind(this, .037, 0.20),

                // to rotate smaller branch position
                '+' : this.rotateTurtle.bind(this, 25, 0, 0),
                '-' : this.rotateTurtle.bind(this, -25, 0, 0),
                'J' :  this.rotateTurtle.bind(this, 0, 0, 25),
                'K' : this.rotateTurtle.bind(this, 0, 0, -25),

                // small increment for branching
                'L' : this.rotateTurtle.bind(this, 0,0,8),

                // to place leaves
                'P' : this.makeLeaf.bind(this, Math.PI / 2),
                'Q' : this.makeLeaf.bind(this, Math.PI * 1.5),
                'W' : this.makeLeaf.bind(this, Math.PI / 4),
                'E' : this.makeLeaf.bind(this, -Math.PI ), 

                // working on making multiple instances of geometry... sad 
                'M' : this.makeForest.bind(this)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = new TurtleState(
            new THREE.Vector3(0,0,0), 
            new THREE.Vector3(0,1,0), 
            );        
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos)
        console.log(this.state.dir)
    }

    saveState() {
        var oldState = new TurtleState(this.state.pos, this.state.dir); 
        this.stack.push(oldState); 
    };

    popState() {
        this.state = this.stack.pop(); 
    };

    makeForest(numTrees) {
        // console.log("hi " + this.ruleArr.length); 
        // for (var i = 0; i < this.ruleArr.length; i++) {
        //     // execute the function ? idk
        //     // console.log(this.ruleArr[i]);
        //     turtle.state.pos = new THREE.Vector(10,0,0); 
        //     this.ruleArr[i];
        // }
        // for (var i = 0; i < this.geometries.length; i ++) {
        //     var newGeom = this.geometries[i];
        //     var newMesh = new THREE.Mesh(newGeom.geometry, newGeom.material);
        //     newMesh.rotation.set(newGeom.rotation.x,newGeom.rotation.y,newGeom.rotation.z);
        //     newMesh.position.set(newGeom.position.x,newGeom.position.y,newGeom.position.z);
        //     this.scene.add(newMesh);
        //     newMesh.translateX(10);    
        // }
    };

    // Rotate the turtle's _dir_ vector by each of the 
    // Euler angles indicated by the input.
    rotateTurtle(x, y, z) {
        var e = new THREE.Euler(
                x * 3.14/180,
				y * 3.14/180,
				z * 3.14/180);
        this.state.dir.applyEuler(e);
    };

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
    // 0x6c8619 light green
    // 0x2a4d19 darker green
    makeCylinder(len, width) {
        var geometry = new THREE.CylinderGeometry(width, width, len);
        var material = new THREE.MeshLambertMaterial( {color: 0x6c8619} );
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
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        // //Scoot the turtle forward by len units
        this.moveForward(len/2);

        this.geometries.push(cylinder); 
        this.ruleArr.push(this.makeCylinder.bind(this, len, width)); 

        // // TRYING TO MAKE A FOREST YALL. ... but it only follows the original state...
        // // it doesn't make a new continuous branch. What to do? 
        // var origState = new THREE.Vector3(this.state.pos.x,this.state.pos.y,this.state.pos.z);
        // for (var i = 0; i < this.dimen; i++) {
        //     this.state.pos = new THREE.Vector3(i + 2,this.state.pos.y - 1, this.state.pos.z);
        //     var geometryi = new THREE.CylinderGeometry(width, width, len);
        //     var materiali = new THREE.MeshLambertMaterial( {color: 0x6c8619} );
        //     var cylinderi = new THREE.Mesh( geometryi, materiali );
        //     this.scene.add(cylinderi);

        //     //Orient the cylinder to the turtle's current direction
        //     var quat = new THREE.Quaternion();
        //     quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        //     var mat4 = new THREE.Matrix4();
        //     mat4.makeRotationFromQuaternion(quat);
        //     cylinderi.applyMatrix(mat4);

        //     //Move the cylinder so its base rests at the turtle's current position
        //     var mat5 = new THREE.Matrix4();
        //     var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        //     mat5.makeTranslation(trans.x, trans.y, trans.z);
        //     cylinderi.applyMatrix(mat5);
        // }
        // // set the state back to its original 
        // this.state.pos = new THREE.Vector3(origState.x,origState.y,origState.z);
    };

    makeSmallBranch(len, width) {
        this.makeCylinder(len, width);
    };

    makeDivider(len, width) {
        var geometry = new THREE.CylinderGeometry(width, width, len);
        var material = new THREE.MeshLambertMaterial( {color: 0xddd8a2} );
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
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        cylinder.applyMatrix(mat5);

        //Scoot the turtle forward by len units
        this.moveForward(len/2);

        this.geometries.push(cylinder); 
        this.ruleArr.push(this.makeDivider.bind(this, len, width)); 

        // FOREST ATTEMPTS 
        // var origState = new THREE.Vector3(this.state.pos.x,this.state.pos.y,this.state.pos.z);
        // for (var i = 0; i < this.dimen; i++) {
        //     this.state.pos = new THREE.Vector3(i + 2,this.state.pos.y , this.state.pos.z);
        //     var geometryi = new THREE.CylinderGeometry(width, width, len);
        //     var materiali = new THREE.MeshLambertMaterial( {color: 0xddd8a2} );
        //     var cylinderi = new THREE.Mesh( geometryi, materiali );
        //     this.scene.add(cylinderi);

        //     //Orient the cylinder to the turtle's current direction
        //     var quat = new THREE.Quaternion();
        //     quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        //     var mat4 = new THREE.Matrix4();
        //     mat4.makeRotationFromQuaternion(quat);
        //     cylinderi.applyMatrix(mat4);

        //     //Move the cylinder so its base rests at the turtle's current position
        //     var mat5 = new THREE.Matrix4();
        //     var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
        //     mat5.makeTranslation(trans.x, trans.y, trans.z);
        //     cylinderi.applyMatrix(mat5);
        // }
        // // set the state back to its original 
        // this.state.pos = new THREE.Vector3(origState.x,origState.y,origState.z);

    };

    rotateBase() {
        // direct the rotation of the base of bamboo through user input (this.angle)
        var x = Math.random() * this.angle - this.angle / 2.0;
        var z = Math.random() * this.angle - this.angle / 2.0;

        var e = new THREE.Euler(
                x * 3.14/180,
                0 * 3.14/180,
                z * 3.14/180);
        this.state.dir.applyEuler(e);
    };

    // DRAW LEAF MESH
    makeLeaf(direction) {
      var leafMesh = new THREE.Mesh(this.mesh.geometry, this.mesh.material);
      leafMesh.scale.set(0.8,0.8,0.8);
      leafMesh.position.set(this.state.pos.x,this.state.pos.y,this.state.pos.z );

      // get a little bit of variation in the leaf orientation
      var randOffset = (Math.random() * 10 - 5) / 20; 

      // orient the leaf based on its direction
      leafMesh.rotateY(direction + randOffset);
      leafMesh.translateX(-1.06);
      leafMesh.translateY(-0.2);
      leafMesh.translateZ(-4.0);
      leafMesh.rotateZ(Math.PI / 7);

      // add leaf to the scene
      this.scene.add(leafMesh);
    
      this.geometries.push(leafMesh);
      this.ruleArr.push(this.rotateBase.bind(this, direction));  
    };

    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        var func = this.renderGrammar[symbolNode.sym];
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