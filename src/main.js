const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {linkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var myTurtle = require('./turtle.js');

// name is a member of myModule due to the export above
// var BranchMaterial = myTurtle.BranchMaterial;
// var LeafMaterial = myTurtle.LeafMaterial;
// var FruitMaterial = myTurtle.FruitMaterial;

var turtle;
var guiParameters = {
    BranchColor: new THREE.Color(0x46271A),// [23,50,138],
    LeafColor: [216,42,42],
    FruitColor: [17,191,52],
}

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

  // set camera position
  camera.position.set(1, 1, 20);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene);

  gui.addColor(guiParameters, 'BranchColor').onChange(function(newVal)
  {
    guiParameters.BranchColor = (new THREE.Color(newVal)).getHex();
    // console.log(guiParameters.BranchColor);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.UpdateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 9).step(1).onChange(function(newVal) {
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
    var result = lsystem.DoIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene);
    turtle.branchcolor = guiParameters.BranchColor;
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework)
{}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
