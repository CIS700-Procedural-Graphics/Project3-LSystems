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
		this.states = [];
		//this.lineWidth = 3.0;

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
		if (typeof grammar === "undefined") {
			
			this.renderGrammar = function(node) {
				switch(node.symbol) {
					case '!':
						this.lineWidth = node.param[0];
						break;
					case '+':
						this.rotateTurtle(node.param[0], 0, 0);
						//this.rotateTurtle(0, -node.param[0], 0);
						break;
					case '/':
						//this.rotateTurtle(0, 0, -node.param[0]);
						var a = Math.random();
						this.rotateTurtle(0, 0, node.param[0]);
						break;					
					case '&':
						var a = Math.random();
						this.rotateTurtle(0, 0, -node.param[0]);
						//this.rotateTurtle(0, 0, -node.param[0]);
						break;
					case '-':
						this.rotateTurtle(-node.param[0], 0, 0);
						break;
					case 'v':
						this.rotateTurtle(0, 120, 0);
						break;
					case 'w':
						this.rotateTurtle(0, 60, 0);
						break;
					case 'F':
						//for (var i = 0; i < 10; i++)
							this.makeCylinder(2, 0.1)
						//this.makeCylinder(node.param[0], this.lineWidth);
						break;
					case 'G':
						for (var i = 0; i < 8; i++)
							this.makeCylinder(2, 2.0)						//this.makeCylinder(node.param[0], this.lineWidth);
						break;
					case 'H':
						for (var i = 0; i < 6; i++)
							this.makeCylinder(2, 1.0)						//this.makeCylinder(node.param[0], this.lineWidth);
						break;
					case 'J':
						for (var i = 0; i < 4; i++)
							this.makeCylinder(2, 0.5)						//this.makeCylinder(node.param[0], this.lineWidth);
					case 'S':
							this.makeSphere(2, 0.3)
						break;
					case '[':
						this.pushState();
						break;
					case ']':
						this.popState();
						break;
					default:
						break;
				}

			}
			
			
		} else {
            this.renderGrammar = grammar;
        }
		
		
		
        /*if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 30, 0, 0),
                '-' : this.rotateTurtle.bind(this, -30, 0, 0),
				'v' : this.rotateTurtle.bind(this, 0, 120, 0),
				'w' : this.rotateTurtle.bind(this, 0, 60, 0),
                'F' : this.makeCylinder.bind(this, 2, 0.1),
				//'G' : this.makeCylinder.bind(this, 1, 0.3),
               // 'H' : this.makeCylinder.bind(this, 1, 0.1),
				'[' : this.pushState.bind(this),
				']' : this.popState.bind(this)
            };
        } else {
            this.renderGrammar = grammar;
        }*/
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
	
	pushState() {
		this.states.push(new TurtleState(this.state.pos, this.state.dir));
	}
	
	popState() {
		this.state = this.states.pop();
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
    makeCylinder(len, width) {
        var geometry = new THREE.CylinderGeometry(width, width, len);
        var material = new THREE.MeshBasicMaterial( {color: 0xFF69B4} );
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
    };
    
	
	makeSphere(len, width) {
        var geometry = new THREE.SphereGeometry(width, width, len);
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
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
    };
	
    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind 
    // functions to grammar symbols.
    renderSymbol(symbolNode) {
       // var func = this.renderGrammar[symbolNode.symbol];
		var func = this.renderGrammar(symbolNode);
		if (func) {
			func();
		}

    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(linkedList) {
        var currentNode;
        for(currentNode = linkedList.head; currentNode != null; currentNode = currentNode.next) {
			currentNode.param[0] = linkedList.rotation;
            this.renderSymbol(currentNode);
        }
    }
}