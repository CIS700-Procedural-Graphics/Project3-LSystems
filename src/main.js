
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import lsys from './lsystem.js'
import Turtle from './turtle.js'

var turtle;

// called after the scene loads
function onLoad(framework) {
  
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);

  scene.add(directionalLight);

  //var loader = new THREE.CubeTextureLoader();
  //var urlPrefix = '';
  //
  //var skymap = new THREE.CubeTextureLoader().load([
  //    urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
  //    urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
  //    urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
  //] );
  //
  //scene.background = skymap;

  // set camera position
  camera.position.set(1, 1, 20);
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.updateProjectionMatrix();

  // initialize LSystem and a Turtle to draw
  var lsystem = new lsys.Lsystem();
  turtle = new Turtle(scene);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsystem, 'axiom').onChange(function(newVal) {
    lsystem.updateAxiom(newVal);
    doLsystem(lsystem, lsystem.iterations, turtle);
  });

  gui.add(lsystem, 'iterations', 0, 12).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsystem, newVal, turtle);
  });

  gui.add(turtle, 'angle', 15, 120).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsystem, lsystem.iterations, turtle);
  });
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
    var result = lsystem.doIterations(iterations);
    turtle.clear();
    var angle = turtle.angle;
    turtle = new Turtle(turtle.scene);
    console.log(turtle);
    turtle.angle = angle;
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
