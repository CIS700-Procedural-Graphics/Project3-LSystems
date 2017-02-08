
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import LSystem from './lsystem.js'
import Turtle from './turtle.js'
import {PlantLSystem, MainCharacter, CactusCharacter, WillowCharacter}  from './plants.js'

var turtle;


function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xff0000, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  // set camera position
  camera.position.set(1, 2, 2);
  camera.lookAt(new THREE.Vector3(0,1,0));

  // // initialize LSystem and a Turtle to draw
  // var lsys = new Lsystem();
  // turtle = new Turtle(scene);

  // gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
  //   camera.updateProjectionMatrix();
  // });

  // gui.add(lsys, 'axiom').onChange(function(newVal) {
  //   lsys.UpdateAxiom(newVal);
  //   doLsystem(lsys, lsys.iterations, turtle);
  // });

  // gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
  //   clearScene(turtle);
  //   doLsystem(lsys, newVal, turtle);
  // });

  // var lSystem = new LSystem("FX", "", 10);
  // lSystem.expand();

  var lSystem = new MainCharacter(2234);
  var expandedChain = lSystem.expand();

  // console.log(expandedChain.toString());

  var mesh = lSystem.generateMesh();
  mesh.scale.set(.3, .3, .3);
  scene.add(mesh);

  var cactus = new CactusCharacter(6565);
  cactus.expand();
  var cactusMesh = cactus.generateMesh();
  cactusMesh.position.set(2, 0, 0);
  cactusMesh.scale.set(.2, .2, .2);
  scene.add(cactusMesh);

  var willow = new WillowCharacter(2135);
  willow.expand();
  var willowMesh = willow.generateMesh();
  willowMesh.position.set(-2, 0, 0);
  willowMesh.scale.set(.2, .2, .2);
  scene.add(willowMesh);
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  var obj;
  for( var i = turtle.scene.children.length - 1; i > 3; i--) {
      obj = turtle.scene.children[i];
      turtle.scene.remove(obj);
  }
}

function doLsystem(lsystem, iterations, turtle) {
    var result = lsystem.DoIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
