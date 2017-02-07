
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {linkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var turtle;
var lsys;

var guiMake = {
  make : function() {
        var result = lsys.doIterations(lsys.iterations);
        turtle.clear();
        //turtle = new Turtle(turtle.scene);
        turtle.renderSymbols(result);
  }
};

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
  camera.position.set(40, 0, 0);
  camera.lookAt(new THREE.Vector3(0,0,0));

      // set skybox
    var loader = new THREE.CubeTextureLoader();
    var urlPrefix = 'images/skymap/';

    var skymap = new THREE.CubeTextureLoader().load([
        urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
        urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
        urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
    ] );

    scene.background = skymap;

    var plane = new THREE.PlaneGeometry(100,1000, 32);
        plane.rotateX(3.14159/2);
        plane.rotateZ(3.14159);
        plane.translate(0,-10,0)
        var material = new THREE.MeshLambertMaterial( {color: 0x005c09, emissive: 0x000000} );
        var ground = new THREE.Mesh(plane, material );
        // leaf.scale.set(100,100,100);
        scene.add(ground);

  // initialize LSystem and a Turtle to draw
  lsys = new Lsystem();
  turtle = new Turtle(scene);
  doLsystem(lsys, lsys.iterations, turtle);

  // gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
  //   camera.updateProjectionMatrix();
  // });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.updateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 20).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
  });
  gui.add(turtle, 'angle', 0, 180).onChange(function(newVal) {
    clearScene(turtle);
    turtle.clear();
    turtle.renderSymbols(lsys.result);
  });
  gui.addColor(turtle, 'stem_color').onChange(function(newVal) {
    clearScene(turtle);
    turtle.clear();
    turtle.renderSymbols(lsys.result);
  });
  gui.addColor(turtle, 'leaf_color').onChange(function(newVal) {
    clearScene(turtle);
    turtle.clear();
    turtle.renderSymbols(lsys.result);
  });
  gui.addColor(turtle, 'flower_color').onChange(function(newVal) {
    clearScene(turtle);
    turtle.clear();
    turtle.renderSymbols(lsys.result);
  });
  gui.add(turtle, 'grow');
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
    //turtle = new Turtle(turtle.scene);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
  if (turtle !== undefined) {
    if (turtle.grow) {
      var date = new Date();
    turtle.angle = date.getSeconds();
    clearScene(turtle);
    turtle.clear();
    turtle.renderSymbols(lsys.result);
    }
    
  }
  
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
