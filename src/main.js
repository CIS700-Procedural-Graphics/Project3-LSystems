
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const OBJLoader = require('three-obj-loader')(THREE)

import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

let turtle;

let audioListener = new THREE.AudioListener();
let sound = new THREE.Audio(audioListener);
let audioLoader = new THREE.AudioLoader();
audioLoader.load('xd.mp3', function (buffer) {
  sound.setBuffer( buffer );
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

window.sceneState = {
  time: 0,
  rot: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
  pos: 60,
};

// called after the scene loads
function onLoad(framework) {
  let scene = framework.scene;
  let camera = framework.camera;
  let renderer = framework.renderer;
  let gui = framework.gui;
  let stats = framework.stats;

  // initialize a simple box and material
  window.directionalLight = new THREE.PointLight( 0xffffff, 1, 100000);
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(20);
  scene.add(directionalLight);

  window.ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  let loader = new THREE.TextureLoader();
  let background = new THREE.TextureLoader().load('420.jpg');
  scene.background = background;
  framework.leaves = [];

  window.snoopDogg = () => {
    for (let i = 0; i < 40; i++) {
      if (!window.blazed) {
        objLoader.load('blazeit.obj', function(obj) {
          let cannabis = new THREE.MeshLambertMaterial({color: 0x106601, side: THREE.DoubleSide});
          let fiveStarMagicalLeaf = obj.children[0].geometry;
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material = cannabis;
            }
          });
          window.XXX420blazeItYoloSwagNoScopeXXX = obj;
          window.blazed = true;
          let leaf = XXX420blazeItYoloSwagNoScopeXXX.clone(true);
          framework.leaves.push(leaf);
          scene.add(leaf);

          leaf.dy = Math.random() * 0.4 + 0.1;
          leaf.dr = Math.random() * 0.03 + 0.005;

          let quat = new THREE.Quaternion();
          quat.setFromUnitVectors(sceneState.rot, new THREE.Vector3(0,1,0));
          let mat4 = new THREE.Matrix4();
          mat4.makeRotationFromQuaternion(quat);
          leaf.applyMatrix(mat4);

          let transMat4 = new THREE.Matrix4();
          transMat4.makeTranslation(Math.random() * 200 - 100, 40 + Math.random() * 40, Math.random() * 200 - 100);
          leaf.applyMatrix(transMat4);
        });
      } else {
        let leaf = XXX420blazeItYoloSwagNoScopeXXX.clone(true);
        framework.leaves.push(leaf);
        scene.add(leaf);

        leaf.dy = Math.random() * 0.4 + 0.1;
        leaf.dr = Math.random() * 0.03 + 0.005;

        let quat = new THREE.Quaternion();
        quat.setFromUnitVectors(sceneState.rot, new THREE.Vector3(0,1,0));
        let mat4 = new THREE.Matrix4();
        mat4.makeRotationFromQuaternion(quat);
        leaf.applyMatrix(mat4);

        let transMat4 = new THREE.Matrix4();
        transMat4.makeTranslation(Math.random() * 200 - 100, 40 + Math.random() * 40, Math.random() * 200 - 100);
        leaf.applyMatrix(transMat4);
      }
    }
  }
  snoopDogg();


  camera.add(audioListener);
  // set camera position
  camera.position.set(5, 20, 40);
  camera.lookAt(new THREE.Vector3(0,0,0));

  let defaultAxiom = "TVZZvZZ11Z$1ZZ22$Z3Z3$Z4Z4Z5";
  let defaultGrammar = `1, 1 => [++HX][++HX][++HX][++HX][++HX][++HX][++HX]
2, 1 => [++HJ][++HJ][++HJ][++HJ][++HJ][++HJ][++HJ]
3, 1 => [++HK][++HK][++HK][++HK][++HK][++HK][++HK]
4, 1 => [++HO][++HO][++HO][++HO][++HO][++HO][++HO]
5, 1 => [++HD][++HD][++HD][++HD][++HD][++HD][++HD][HW][HW][HW][HW][%%%%%%%D]
T, 1 => Grrrrrrrrrbbbbbbbb
X, 1 => FW
X, 1 => FFW
X, 1 => FFFW
X, 3 => FFFFW
X, 3 => FFFFW5
X, 3 => F[+HFFW][+HFFW]
X, 2 => F[HFFW][+HFFW][+HFFW]
X, 2 => F[HFFW]F[+HFW][+HFFW]
J, 1 => FW
J, 1 => FFW
J, 3 => FFFW
J, 2 => FFFW5
J, 3 => F[+HFFW][-HFFW]
K, 1 => FW
K, 3 => FFW
K, 3 => F[+HFW][-HFW]
K, 1 => FFW5
O, 1 => FW
O, 0.5 => FW5
O, 1 => [+HFW][-HFW]
H, 1 =>
H, 1 => .
H, 1 => ..
H, 1 => ...
H, 1 => ....
H, 1 => .....
H, 1 => ......
H, 1 => ,,,,,
H, 1 => ,,,,
H, 1 => ,,,
H, 1 => ,,
H, 1 => ,
Z, 8 => VVFvv`;
  let defaultIterations = 8;
  let textArea = document.getElementById('grammar');
  textArea.value = defaultGrammar;
  textArea.addEventListener('keyup', (e) => {
    clearScene(turtle);
    lsys.updateGrammar(e.target.value);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  document.addEventListener('click', (e) => {
    if (e.target !== textArea) {
      textArea.blur();
    }
  })

  // initialize LSystem and a Turtle to draw
  let lsys = new Lsystem(defaultAxiom, defaultGrammar, defaultIterations);
  turtle = new Turtle(scene);
  doLsystem(lsys, lsys.iterations, turtle);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    clearScene(turtle);
    lsys.updateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
  });
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  let obj;
  for( let i = turtle.scene.children.length - 1; i >= 0; i--) {
      obj = turtle.scene.children[i];
      turtle.scene.remove(obj);
  }
  turtle.scene.add(directionalLight);
  turtle.scene.add(ambientLight);
  snoopDogg();
}

function doLsystem(lsystem, iterations, turtle) {
    let result = lsystem.doIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
  if (!framework.leaves) {
    return;
  }
  sceneState.time += 1;
  for (let i = 0; i < framework.leaves.length; i++) {
    let leaf = framework.leaves[i];

    leaf.rotateX(leaf.dr);
    leaf.updateMatrix();

    let cutoff = -100
    if (leaf.position.y <= cutoff) {
      let transMat4 = new THREE.Matrix4();
      transMat4.makeTranslation(0, 80 - cutoff, 0);
      leaf.applyMatrix(transMat4);
    } else {
      let transMat4 = new THREE.Matrix4();
      transMat4.makeTranslation(0, -leaf.dy, 0);
      leaf.applyMatrix(transMat4);
    }
  }

}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
