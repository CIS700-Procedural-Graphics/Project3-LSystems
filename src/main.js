
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
const _ = require('lodash');
import Framework from './framework'
import Lsystem, { LinkedListToString } from './lsystem.js'
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

  // set camera position
  camera.position.set(0, 0, 40);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onFinishChange(function(newVal) {
    doLsystem(lsys, newVal, turtle);
  });

  gui.add(lsys, 'axiom').onFinishChange(function(newVal) {
    lsys.UpdateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  _.each(lsys.grammar, (rules, char) => {
    var i = 1;
    var grammarFolder = gui.addFolder(char);

    _.each(rules, rule => {

      grammarFolder.add(rule, 'probability').name('Rule ' + i + ' prob').onFinishChange(function(newVal) {
        doLsystem(lsys, lsys.iterations, turtle);
      });

      grammarFolder.add(rule, 'successorString').name('Rule ' + i + ' replace').onFinishChange(function(newVal) {
        doLsystem(lsys, lsys.iterations, turtle);
      });

      i++;
    });
  });


  var turtleFolder = gui.addFolder('Turtle');

  turtleFolder.add(turtle, 'rotY').name('Rotation Y').onFinishChange(function(newVal) {
    doLsystem(lsys, lsys.iterations, turtle);
  });

  turtleFolder.add(turtle, 'rotZ').name('Rotation Z').onFinishChange(function(newVal) {
    doLsystem(lsys, lsys.iterations, turtle);
  });

  turtleFolder.add(turtle, 'cylX').name('Cylinder width').onFinishChange(function(newVal) {
    doLsystem(lsys, lsys.iterations, turtle);
  });

  turtleFolder.add(turtle, 'cylY').name('Cylinder height').onFinishChange(function(newVal) {
    doLsystem(lsys, lsys.iterations, turtle);
  });

  turtleFolder.addColor(turtle, 'cylColor').name('Cylinder color').onChange(function(newVal) {
    doLsystem(lsys, lsys.iterations, turtle);
  });

  turtleFolder.addColor(turtle, 'leafColor').name('Leaf color').onChange(function(newVal) {
    doLsystem(lsys, lsys.iterations, turtle);
  });

  turtleFolder.addColor(turtle, 'flowerColor').name('Flower color').onChange(function(newVal) {
    doLsystem(lsys, lsys.iterations, turtle);
  });

  doLsystem(lsys, lsys.iterations, turtle);
}

function doLsystem(lsystem, iterations, turtle) {
  var result = lsystem.DoIterations(iterations);

  turtle.clear();
  turtle.clearScene();
  turtle.updateGrammar();
  turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
