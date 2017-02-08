const THREE = require('three')
const OBJLoader = require('three-obj-loader')(THREE)

window.three = THREE;
window.xd = new THREE.Vector3(0.3, -0.54, -0.62).normalize();
window.f = (a, b, c) => {
  window.xd = new three.Vector3(a, b, c).normalize();
}
window.objLoader = new THREE.OBJLoader();

objLoader.load('feather.obj', function(obj) {
  let lambertGreen = new THREE.MeshLambertMaterial({color: 0x66FF66, side: THREE.DoubleSide});
  let leafGeo = obj.children[0].geometry;
  window.leafMesh = new THREE.Mesh(leafGeo, lambertGreen);
});

objLoader.load('bud.obj', function(obj) {
  let cannabis = new THREE.MeshLambertMaterial({color: 0x254f1e, side: THREE.DoubleSide});
  let fiveStarMagicalLeaf = obj.children[0].geometry;
  obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
          child.material = cannabis;
      }
  });
  window.dankAfSystem = obj;
});

let TurtleState = function(pos, dir, scale) {
    return {
        pos: new THREE.Vector3(pos.x, pos.y, pos.z),
        dir: new THREE.Vector3(dir.x, dir.y, dir.z),
        scale: scale,
    };
};

export default class Turtle {

    constructor(scene, grammar) {
        window.t = this;
        this.state = new TurtleState(new THREE.Vector3(0,-5,0), new THREE.Vector3(0,1,0), 0);
        this.storedStates = [];
        this.color = {
          r: 127,
          g: 127,
          b: 127
        };
        this.scene = scene;
        this.cylinderLen = 2.0;
        this.cylinderWidth = 0.1;

        // TODO: Start by adding rules for '[' and ']' then more!
        // Make sure to implement the functions for the new rules inside Turtle
        if (typeof grammar === "undefined") {
            this.renderGrammar = {
                '+' : this.rotateTurtle.bind(this, 30, 0, 0),
                '-' : this.rotateTurtle.bind(this, -30, 0, 0),
                ',' : this.rotateTurtle.bind(this, 0, 30, 0),
                '.' : this.rotateTurtle.bind(this, 0, -30, 0),
                '<' : this.rotateTurtle.bind(this, 0, 0, 30),
                '>' : this.rotateTurtle.bind(this, 0, 0, -30),
                'F' : this.makeCylinder.bind(this),
                'L' : this.makeBoringAssLeaf.bind(this, 0.1),
                'W' : this.makeLoveNotWar.bind(this, 0.5),
                'D' : this.makeSomeBud.bind(this, 2),
                'R' : this.addColor.bind(this, 0.1, 0, 0),
                'r' : this.addColor.bind(this, -0.1, 0, 0),
                'G' : this.addColor.bind(this, 0, 0.1, 0),
                'g' : this.addColor.bind(this, 0, -0.1, 0),
                'B' : this.addColor.bind(this, 0, 0, 0.1),
                'b' : this.addColor.bind(this, 0, 0, -0.1),
                '%' : this.addScale.bind(this, 0.1),
                '$' : this.addScale.bind(this, -0.1),
                'C' : this.addLen.bind(this, 0.5),
                'c' : this.addLen.bind(this, -0.5),
                'V' : this.addWidth.bind(this, 0.1),
                'v' : this.addWidth.bind(this, -0.1),
                '[' : this.saveState.bind(this),
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

    saveState() {
      let pos = this.state.pos;
      let dir = this.state.dir;
      let newPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      let newDir = new THREE.Vector3(dir.x, dir.y, dir.z);
      let newState = new TurtleState(newPos, newDir, this.state.scale);
      this.storedStates.push(newState);
    }

    restoreState() {
      this.state = this.storedStates.pop();
    }

    addColor(r, g, b) {
      let clamp = (min, val, max) => {
        return Math.min(Math.max(val, min), max);
      };
      this.color = {
        r: clamp(0, r * 255 + this.color.r, 255),
        g: clamp(0, g * 255 + this.color.g, 255),
        b: clamp(0, b * 255 + this.color.b, 255)
      };
    }

    addLen(len) {
      this.cylinderLen += len;
    }

    addWidth(width) {
      this.cylinderWidth += width;
    }

    addScale(scale) {
      this.state.scale += scale;
    }

    // Make a cylinder of given length and width starting at turtle pos
    // Moves turtle pos ahead to end of the new cylinder
    makeCylinder() {
      let len = this.cylinderLen;
      let width = this.cylinderWidth;
      let geometry = new THREE.CylinderGeometry(width, width, len);
      let material = new THREE.MeshBasicMaterial( {color: this.getColor()} );
      let cylinder = new THREE.Mesh( geometry, material );
      this.scene.add( cylinder );

      let quat = new THREE.Quaternion();
      quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
      let mat4 = new THREE.Matrix4();
      mat4.makeRotationFromQuaternion(quat);
      cylinder.applyMatrix(mat4);

      let transMat4 = new THREE.Matrix4();
      let trans = this.state.pos.add(this.state.dir.multiplyScalar(0.5 * len));
      transMat4.makeTranslation(trans.x, trans.y, trans.z);
      cylinder.applyMatrix(transMat4);

      this.moveForward(len/2);
    };

    makeBoringAssLeaf(size) {
      size += this.state.scale;
      let leaf = leafMesh.clone(true);
      this.scene.add(leaf);

      //Orient the cylinder to the turtle's current direction
      let quat = new THREE.Quaternion();
      quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
      let mat4 = new THREE.Matrix4();
      mat4.makeRotationFromQuaternion(quat);
      leaf.applyMatrix(mat4);

      let scaleMat4 = new THREE.Matrix4();
      scaleMat4.makeScale(size, size, size);
      leaf.applyMatrix(scaleMat4);

      //Move the leaf so its base rests at the turtle's current position
      let transMat4 = new THREE.Matrix4();
      transMat4.makeTranslation(this.state.pos.x, this.state.pos.y, this.state.pos.z);
      leaf.applyMatrix(transMat4);
    }

    makeLoveNotWar(size) {
      size += this.state.scale;
      let leaf = XXX420blazeItYoloSwagNoScopeXXX.clone(true);
      this.scene.add(leaf);

      let quat = new THREE.Quaternion();
      // quat.setFromUnitVectors(this.state.dir, new THREE.Vector3(-0.8,1,3).normalize());
      // quat.setFromUnitVectors(window.xd.normalize(), this.state.dir);
      // quat.setFromEuler(window.xd.normalize());
      quat.setFromUnitVectors(new THREE.Vector3(0.3708375233439214, -0.4997954893053042, -0.7827413366816768), this.state.dir);
      let mat4 = new THREE.Matrix4();
      mat4.makeRotationFromQuaternion(quat);
      leaf.applyMatrix(mat4);

      let scaleMat4 = new THREE.Matrix4();
      scaleMat4.makeScale(size, size, size);
      leaf.applyMatrix(scaleMat4);

      let transMat4 = new THREE.Matrix4();
      transMat4.makeTranslation(this.state.pos.x, this.state.pos.y, this.state.pos.z);
      leaf.applyMatrix(transMat4);

    }

    makeSomeBud(size) {
      size += this.state.scale;
      let bud = dankAfSystem.clone(true);
      this.scene.add(bud);

      let quat = new THREE.Quaternion();
      quat.setFromUnitVectors(new THREE.Vector3(0,1,0), this.state.dir);
      let mat4 = new THREE.Matrix4();
      mat4.makeRotationFromQuaternion(quat);
      bud.applyMatrix(mat4);

      let scaleMat4 = new THREE.Matrix4();
      scaleMat4.makeScale(size, size, size);
      bud.applyMatrix(scaleMat4);

      //Move the bud so its base rests at the turtle's current position
      let transMat4 = new THREE.Matrix4();
      transMat4.makeTranslation(this.state.pos.x, this.state.pos.y, this.state.pos.z);
      bud.applyMatrix(transMat4);
    }

    rotateTurtle(x, y, z) {
      // SOME WHIMSICALITY LELXD
      x += Math.random() * 10 - 5;
      y += Math.random() * 10 - 5;
      z += Math.random() * 10 - 5;
      let e = new THREE.Euler(x * 3.14/180, y * 3.14/180, z * 3.14/180);
      this.state.dir.applyEuler(e);
    }

    // Translate the turtle along the input vector.
    // Does NOT change the turtle's _dir_ vector
    moveTurtle(x, y, z) {
	    let new_vec = THREE.Vector3(x, y, z);
	    this.state.pos.add(new_vec);
    };

    // Translate the turtle along its _dir_ vector by the distance indicated
    moveForward(dist) {
      let newVec = this.state.dir.multiplyScalar(dist);
      this.state.pos.add(newVec);
    };

    getColor() {
      return (this.color.r << 16) + (this.color.g << 8) + this.color.b;
    }

    // Call the function to which the input symbol is bound.
    // Look in the Turtle's constructor for examples of how to bind
    // functions to grammar symbols.
    renderSymbol(symbol) {
      let func = this.renderGrammar[symbol];
      if (func) {
          func();
      }
    };

    // Invoke renderSymbol for every node in a linked list of grammar symbols.
    renderSymbols(str) {
      for (let i = 0; i < str.length; i++) {
        this.renderSymbol(str[i]);
      }
    }
}
