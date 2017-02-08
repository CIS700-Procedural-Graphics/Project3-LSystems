
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var turtle;
var turtleArr; 

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
  directionalLight.position.set(1, 1, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  var light = new THREE.AmbientLight( 0x404040, 1.5 ); // soft white light
  scene.add( light );

  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // add in plane
  var geometry = new THREE.PlaneGeometry( 30, 30, 1, 1 );
  var material = new THREE.MeshBasicMaterial( { color: 0xcbccb8 } );
  var floor = new THREE.Mesh( geometry, material );
  floor.material.side = THREE.DoubleSide;
  floor.rotation.set(Math.PI / 2,0,0); 
  scene.add( floor );

  // var geometry2 = new THREE.PlaneGeometry( 30, 30, 1, 1 );
  // var floor2 = new THREE.Mesh( geometry2, material );
  // floor2.material.side = THREE.DoubleSide;
  // floor2.rotation.set(Math.PI / 2.0,0,Math.PI / 4.0);
  // scene.add(floor2);

  // load a simple obj mesh
  var objLoader = new THREE.OBJLoader();
  objLoader.load('geo/leaf.obj', function(obj) {
    var leafGeo = obj.children[0].geometry;
    var leafMat = new THREE.MeshLambertMaterial( {color: 0x9fbf12} );
    var leafMesh = new THREE.Mesh(leafGeo, leafMat);
    leafMesh.position.set(3,3,3);
    leafMesh.name = "feather";
    scene.add(leafMesh);
  });

  // initialize LSystem and a Turtle to draw  
  var lsys = new Lsystem();
  turtle = new Turtle(scene); 

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
    turtle = new Turtle(turtle.scene);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
