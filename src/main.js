
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var turtle;
var whichTree = {
  tree: 0
}
var colorAttrib = {
  r: 100,
  g: 100,
  b: 100
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
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  // DISPLAYS THE CURRENT AXIOM
  gui.add(lsys, 'axiom').listen().onChange(function(newVal) {
    lsys.UpdateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'begAxiom').listen().onChange(function(newVal) {
    lsys.updateBegAxiom(newVal);
  });

  gui.add(lsys, 'iterations', 0, 12).listen().step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
  });

 // GUI ELEMENT FOR PICKING IF DRAWING ORIGINAL AXIOM OR DRAWING A PLANT
  gui.add(whichTree, 'tree', 0, 1).listen().step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
  });

  gui.add(colorAttrib, 'r', 0, 255).listen().step(1).onChange(function(newVal) {
    clearScene(turtle);
    // updating colorAttrib. giving new turtle created in doLsystem the proper coloring there
    doLsystem(lsys, lsys.iterations, turtle);
  });
  gui.add(colorAttrib, 'g', 0, 255).listen().step(1).onChange(function(newVal) {
    clearScene(turtle);
    // updating colorAttrib. giving new turtle created in doLsystem the proper coloring there
    doLsystem(lsys, lsys.iterations, turtle);
  });
  gui.add(colorAttrib, 'b', 0, 255).listen().step(1).onChange(function(newVal) {
    clearScene(turtle);
    // updating colorAttrib. giving new turtle created in doLsystem the proper coloring there
    doLsystem(lsys, lsys.iterations, turtle);
  });
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  var obj;
  for( var i = turtle.scene.children.length - 1; i > 0; i--) { //-HB changed i>3 to i>0 bc left remnant items in scene before
      obj = turtle.scene.children[i];
      turtle.scene.remove(obj);
  }
}

function doLsystem(lsystem, iterations, turtle) {
    var result = lsystem.doIterations(iterations, whichTree.tree); // stating which tree is being built
    turtle.clear();
    turtle = new Turtle(turtle.scene); 
    // updating new turtle's color values to proper attributes
    turtle.color.r = colorAttrib.r;
    turtle.color.g = colorAttrib.g;
    turtle.color.b = colorAttrib.b;

    // rendering resulting structuring
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
