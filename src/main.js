
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {linkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var turtle;
var result;

var Sliders = function() {
  this.anglefactor = 0.75;
};
var sliders = new Sliders();

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;
  var controls = framework.controls;

  var directionalLight = new THREE.DirectionalLight(0xFFDAB9, 0.85);
  //directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0xFFDAB9, 0.15); // soft white light
  scene.add( ambientLight );

  // set camera position
  camera.position.set(0, 15, 65);
  camera.lookAt(new THREE.Vector3(0,25,0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene);

  doLsystem(lsys, 1, sliders.anglefactor);

  /*
  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.UpdateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, sliders.anglefactor);
  });
  */
  gui.add(lsys, 'iterations', 0, 4).step(1).onChange(function(newVal) {
    clearScene();
    doLsystem(lsys, newVal, sliders.anglefactor);
  });
  gui.add(sliders, 'anglefactor', 0.5, 1.0).step(0.05).onChange(function(newVal) {
    clearScene();
    turtle = new Turtle(turtle.scene, lsys.iterations, newVal);
    turtle.renderSymbols(result);
  });
}

// clears the scene by removing all geometries added by turtle.js
function clearScene() {
  for (var mesh of turtle.allMeshes) {
      mesh.material.dispose();
      mesh.geometry.dispose();
      turtle.scene.remove(mesh);
      //framework.renderer.deallocateObject( mesh );
  }
  turtle.allMeshes = new Set();    
}

function doLsystem(lsystem, iterations, anglefactor) {
    result = lsystem.doIterations(iterations);
    turtle = new Turtle(turtle.scene, iterations, anglefactor);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
  //console.log(framework.camera.position);
  //console.log(framework.controls.target);
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
