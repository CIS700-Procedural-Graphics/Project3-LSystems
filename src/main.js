
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var turtle;
var lMesh; 
var branchAngle = 8.0;

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // set background
  renderer.setClearColor (0x9cb49c, 1);

  // initialize a simple box and material
  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 2, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);
  // add in an ambient light 
  var light = new THREE.AmbientLight( 0x404040, 1.5 );
  scene.add(light);

  // set camera position
  camera.position.set(10, 3, 10);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // add in ground plane
  var material = new THREE.MeshLambertMaterial( { color: 0xcbccb8 } );
  var geometry = new THREE.CylinderGeometry( 30, 30, 1, 50 );
  var cylinder = new THREE.Mesh( geometry, material );
  scene.add( cylinder );

  // load leaf mesh
  var objLoader = new THREE.OBJLoader();
  objLoader.load('geo/leafgroup.obj', function(obj) {
    var leafGeo = obj.children[0].geometry;
    // lime green 0x9fbf12
    // another green 0x6c8619
    var leafMat = new THREE.MeshLambertMaterial( {color: 0x9ab021} );
    var leafMesh = new THREE.Mesh(leafGeo, leafMat);
    lMesh = leafMesh; 
  });

  // initialize LSystem and a Turtle to draw  
  var lsys = new Lsystem();
  turtle = new Turtle(scene, lMesh, 0x6c8619); 

  // GUI stuff
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.updateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
  });

  var guiItems = function() {
    this.branchAngle = 8.0;
  }
  var guio = new guiItems(); 
  gui.add(guio, 'branchAngle', 0, 30).step(1).onChange(function(newVal) {
    clearScene(turtle);
    branchAngle = newVal;
    turtle.angle = branchAngle;
    doLsystem(lsys, lsys.iterations, turtle);
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

// completes the lsystem
function doLsystem(lsystem, iterations, turtle) {
    var result = lsystem.doIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene, lMesh, branchAngle);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
