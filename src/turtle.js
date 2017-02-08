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
        this.SaveStack = [];
        this.index = 0;
        this.angle_g = 0.0;
        this.branchcolor = new THREE.Vector3( 0x8B4513 );
        // this.leafcolor = new THREE.Vector3( 0x32CD32 );
        // this.fruitcolor = new THREE.Vector3( 0x990000 );

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 30, 0, 30),
                '-' : this.rotateTurtle.bind(this, -30, 0, -30),
                'F' : this.makeCylinder.bind(this, 2, 0.1),
                'X' : this.makeCylinder.bind(this, 2, 0.1), //branch
                'A' : this.makeFruit.bind(this, 0.2), //leaf
                'L' : this.makeLeaf.bind(this, 0.1, 0.2), //fruit
                'a' : this.radialrotate.bind(this), //radial growth
                '[' : this.saveState.bind(this),
                ']' : this.respawnAtState.bind(this)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear()
    {
        this.state = new TurtleState(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0));
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState()
    {
        console.log(this.state.pos)
        console.log(this.state.dir)
    }

    // Rotate the turtle's _dir_ vector by each of the
    // Euler angles indicated by the input.
    rotateTurtle(x, y, z)
    {
        var e = new THREE.Euler(x * 3.14/180,
                        				y * 3.14/180,
                        			  z * 3.14/180);
        this.state.dir.applyEuler(e);
    }

    radialrotate()
    {
        var axis = new THREE.Vector3( 0, 1, 0 );
        var angle = (this.angle_g) * 3.14/180;
        this.state.dir.applyAxisAngle( axis, angle );
        // console.log(this.angle_g);
        this.angle_g += 45;
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
        var Bmaterial = new THREE.MeshBasicMaterial( {color: this.branchcolor} );
        var cylinder = new THREE.Mesh( geometry, Bmaterial );
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
    };

    makeFruit(radius) {
        var sphereGeom = new THREE.IcosahedronGeometry(radius, 3);
        var Fmaterial = new THREE.MeshBasicMaterial( {color: 0x990000} );
        var sphere = new THREE.Mesh( sphereGeom, Fmaterial );
        // sphere.position.set(this.state.pos);
        // sphere.scale.set(0.1,0.1,0.1);
        this.scene.add( sphere );

        //Move the cylinder so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var mat6 = new THREE.Matrix4();
        var trans = this.state.pos;
        // var pos = sphere.position;
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        sphere.applyMatrix(mat5);

        // Leaf.applyMatrix(mat5);
        //apply scaling after
        sphere.scale.set(1, 1, 1);
        sphere.rotateZ(-15* 3.14/180);
        var pos = sphere.position;
        sphere.position.set(pos.x, pos.y-0.1, pos.z);
    };

    makeLeaf(radius, length){
      var sphereGeom = new THREE.IcosahedronGeometry(radius, 3);
      var Lmaterial = new THREE.MeshBasicMaterial( {color: 0x32CD32} ); ///0x990000
      var Leaf = new THREE.Mesh( sphereGeom, Lmaterial );
      this.scene.add( Leaf );

      //Move the cylinder so its base rests at the turtle's current position
      var mat5 = new THREE.Matrix4();
      var mat6 = new THREE.Matrix4();
      var trans = this.state.pos;
      var pos = Leaf.position;
      // mat6.makeRotationZ ( 15* 3.14/180);
      mat5.makeTranslation(trans.x, trans.y, trans.z);
      // mat5 *= mat6;
      Leaf.applyMatrix(mat5);

      // Leaf.applyMatrix(mat5);
      //apply scaling after
      Leaf.scale.set(1, 10, 1);
      Leaf.rotateZ(-15* 3.14/180);
      var pos = Leaf.position;
      Leaf.position.set(pos.x, pos.y-1, pos.z);
    }

    saveState()
    {
        this.SaveStack.push(new TurtleState(this.state.pos, this.state.dir));
    };

    respawnAtState()
    {
        this.state = this.SaveStack.pop();
    };

    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind
    // functions to grammar symbols.
    renderSymbol(symbolNode)
    {
        // var func = this.renderGrammar[symbolNode.character];
        var func = this.renderGrammar[symbolNode.grammar];
        if (func) {
            func();
        }
    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(linkedList)
    {
        var currentNode;
        //  for(currentNode = linkedList.head; currentNode != null; currentNode = currentNode.next)
        for(currentNode = linkedList.first; currentNode != null; currentNode = currentNode.next)
        {
            this.renderSymbol(currentNode);
        }
    }
}
