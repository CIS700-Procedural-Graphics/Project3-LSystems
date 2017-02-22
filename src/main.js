const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'
const OBJLoader = require('three-obj-loader')(THREE)

var turtle;
var directionalLight;
var lambertGreen;
var leaf_geo;
var leaf_mesh;
var lsys;
var falling_leaves  = [];
var time = 0;
// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  directionalLight = new THREE.PointLight( 0xffffff, 1, 100000 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  var audio_listener = new THREE.AudioListener();
  var hokage = new THREE.Audio(audio_listener);
  var hokage_loader = new THREE.AudioLoader();
  hokage_loader.load('hokage.mp3', function(buffer) {
    hokage.setBuffer(buffer);
    hokage.setLoop(true);
    hokage.setVolume(0.5);
    hokage.play();
  });

  var background_loader = new THREE.TextureLoader();
  var background = new THREE.TextureLoader().load('konoha.jpg');
  scene.background = background;

  var lsys = new Lsystem();
  var loader = new THREE.OBJLoader();
  loader.load('Leaf.obj', function(object) {
    lambertGreen = new THREE.MeshLambertMaterial({ color: 0x228B22, side: THREE.DoubleSide });
    leaf_geo = object.children[0].geometry;
    leaf_mesh = new THREE.Mesh(leaf_geo, lambertGreen);
    leaf_mesh.name = "leaf";
    leaf_mesh.position.set(0, 0, 0);
    for (var i = 0; i < 100; i++) {
      var leaf = leaf_mesh.clone();
      leaf.scale.set(1/600, 1/600, 1/600);
      leaf.position.set(Math.random() * 20 - 10, Math.random() * 10, Math.random() * 20 - 10);
      leaf.rotateZ(170);
      falling_leaves[i] = leaf;
      scene.add(leaf);
    }
  });

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene, undefined, new THREE.Vector3(0,0,0), 0.1, 2, leaf_mesh);

  clearScene(turtle);
  doLsystem(lsys, 0, turtle);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.updateAxiom(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
    for (var i = 0; i < 100; i++) {
      scene.add(falling_leaves[i]);
    }
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
    for (var i = 0; i < 100; i++) {
      scene.add(falling_leaves[i]);
    }
  });
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  var obj;
  for( var i = turtle.scene.children.length - 1; i >=0; i--) {
      obj = turtle.scene.children[i];
      turtle.scene.remove(obj);
  }
  turtle.scene.add(directionalLight);
}

function doLsystem(lsystem, iterations, turtle) {
    lsystem.iterations = iterations;
    var result = lsystem.doIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene, undefined, new THREE.Vector3(0, 0, 0), 0.1, 1, leaf_mesh);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
  for (var i = 0; i < 100; i++) {
    var leaf = falling_leaves[i];
    if (leaf) {
      leaf.rotateY(0.1);
      if (leaf.position.y < 0) {
        leaf.position.set(Math.random() * 20 - 10, 10, Math.random() * 20 - 10);
      }
      else {
        leaf.translateY(-0.1);
      }
    }
  }
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
