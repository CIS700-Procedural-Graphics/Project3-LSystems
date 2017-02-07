const THREE = require('three')
import LinkedList from './lsystem.js'

// A class used to encapsulate the state of a turtle at a given moment.
// The Turtle class contains one TurtleState member variable.
// You are free to add features to this state class,
// such as color or whimiscality
var TurtleState = function(pos, dir, c) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        dir: new THREE.Vector3(dir.x, dir.y, dir.z),
        iter: 0
    }
}

var points = [];
for (var i = 0; i < 10; i ++) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
}
  
export default class Turtle {
    
    constructor(scene, grammar) {
        this.state = new TurtleState(new THREE.Vector3(0,-10,0), new THREE.Vector3(0,1,0));
        this.scene = scene;
        this.stack = [];
        this.flower_color = 0xff1111;
        this.leaf_color = 0x167400;
        this.stem_color = 0x361900;
        this.angle = 30;
        this.tree = new LinkedList();
        this.grow = false;

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 1, 1, 1),
                '-' : this.rotateTurtle.bind(this, -1, -1, -1),
                '^' : this.rotateTurtle.bind(this, 0, 1, 0),
                'v' : this.rotateTurtle.bind(this, 0, -1, 0),
                '>' : this.rotateTurtle.bind(this, 1, 0, 0),
                '<' : this.rotateTurtle.bind(this, -1, 0, 0),
                '(' : this.rotateTurtle.bind(this, 0, 0, 1),
                ')' : this.rotateTurtle.bind(this, 0, 0, -1),
                // grow trunk
                'F' : this.makeCylinder.bind(this, 2, 0.2, 0.2),
                'A' : this.makeCylinder.bind(this, 2, 0.8, 1.0),
                'B' : this.makeCylinder.bind(this, 2, 0.6, 0.8),
                'C' : this.makeCylinder.bind(this, 2, 0.4, 0.6),
                'D' : this.makeCylinder.bind(this, 2, 0.2, 0.4),
                '[' : this.saveState.bind(this),
                ']' : this.restoreState.bind(this),
                '*' : this.makeFlower.bind(this, 1),
                '#' : this.makeLeaf.bind(this, 1)
            };
        } else {
            this.renderGrammar = grammar;
        }
    }

    // Resets the turtle's position to the origin
    // and its orientation to the Y axis
    clear() {
        this.state = new TurtleState(new THREE.Vector3(0,-10,0), new THREE.Vector3(0,1,0));  
        this.stack = [];      
    }

    // A function to help you debug your turtle functions
    // by printing out the turtle's current state.
    printState() {
        console.log(this.state.pos)
        console.log(this.state.dir)
    }

    saveState() {
        var s = new TurtleState(this.state.pos, this.state.dir);
        this.stack.push(s);
    }

    restoreState() {
        var s = this.stack.pop();
        this.state = s;
    }

    // Rotate the turtle's _dir_ vector by each of the 
    // Euler angles indicated by the input.
    rotateTurtle(x, y, z) {
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

    makeGeometry(geo, scale) {
        this.scene.add( geo );

        //Orient the flower to the turtle's current direction
        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        geo.applyMatrix(mat4);

        //Move the flower so its base rests at the turtle's current position
        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * scale));
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        geo.applyMatrix(mat5);
    }

    bias(b, t) {
        return Math.pow(t, Math.log(b)/Math.log(0.5));
    }
    
    // Make a cylinder of given length and width 0.1 starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder 
    makeCylinder(len, widthA, widthB) {
        var geometry = new THREE.CylinderGeometry(widthA, widthB, len);
        var material = new THREE.MeshLambertMaterial( {color: 0x333333, emissive: this.stem_color} );
        //var material = new THREE.ShaderMaterial(this.stem_mat);
        var cylinder = new THREE.Mesh( geometry, material );

        this.makeGeometry(cylinder, len);

        //Scoot the turtle forward by len units
        this.moveForward(len/2);
    };

    makeFlower(scale) {
        var geometry = new THREE.LatheGeometry(points);
        geometry.scale(0.05, 0.05, 0.05);
        var material = new THREE.MeshLambertMaterial( {color: 0xcccccc, emissive: this.flower_color} );
        var flower = new THREE.Mesh( geometry, material );

        this.scene.add(flower);

        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        flower.applyMatrix(mat4);

        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos;
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        flower.applyMatrix(mat5);

        // this.moveForward(1);
    }

    makeLeaf(scale) {

        

        var geometry = new THREE.ConeGeometry(0.6, 1, 32);
        // geometry.scale(0.05, 0.05, 0.05);
        var material = new THREE.MeshLambertMaterial( {color: 0xcccccc, emissive: this.leaf_color} );
        var leaf = new THREE.Mesh(geometry, material );
        // leaf.scale.set(100,100,100);
        
        this.scene.add(leaf);

        var quat = new THREE.Quaternion();
        quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
        var mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        leaf.applyMatrix(mat4);

        var mat5 = new THREE.Matrix4();
        var trans = this.state.pos;
        mat5.makeTranslation(trans.x, trans.y, trans.z);
        leaf.applyMatrix(mat5);

        // this.moveForward(1);
    }
    
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
        var func = this.renderGrammar[symbolNode.sym];
        this.state.iter = symbolNode.iter;
        if (func) {
            func(symbolNode);
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