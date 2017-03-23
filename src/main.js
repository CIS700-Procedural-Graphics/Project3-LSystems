
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var lsys;
var turtle;
var numIters;
var flowerGeo;
var time;

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var directionalLight = new THREE.PointLight( 0xffffff, 1 );
  directionalLight.color.setHSL(0.1, 1, 0.95);
  directionalLight.position.set(1, 3, 2);
  directionalLight.position.multiplyScalar(10);
  scene.add(directionalLight);

  // set camera position
  camera.position.set(0, 5, 20);
  camera.lookAt(new THREE.Vector3(0, 5, 0));

  var loader = new THREE.TextureLoader();
  var background = new THREE.TextureLoader().load('gradient01.jpg');
  scene.background = background;

  var material = new THREE.MeshLambertMaterial( { color: 0xf272ba, side: THREE.DoubleSide});
  //add flowers to scene
  // load a simple obj mesh
  var objLoader = new THREE.OBJLoader();
  objLoader.load('flowerPetal.obj', function(obj){

    // LOOK: This function runs after the obj has finished loading
    flowerGeo =  obj.children[0].geometry;
    flowerGeo.scale(0.2, 0.1, 0.2);

    for(var i = -6; i <= 0; i++)
  {
    for(var j = -3; j <= 3; j++)
    {
        var rando = Math.floor(Math.random()*5 + 5);
        var rando2 = Math.floor(Math.random()*10 + 5);
        var rando3 = Math.floor(Math.random()*20 - 5);
        var flower = new THREE.Mesh(flowerGeo, material);
        flower.name = "flower" + i + j; //used in onUpdate
        flower.position.set(i*rando, 25+rando3, j*rando2);
        scene.add(flower);
    }
  }
  });
  
  

  time = 0;

  // initialize LSystem and a Turtle to draw
  lsys = new Lsystem();
  turtle = new Turtle(scene);
  numIters = 0;

  doLsystem(lsys, lsys.iterations, turtle);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    clearScene(turtle);
    lsys.UpdateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
    clearScene(turtle);
    numIters = newVal;
    doLsystem(lsys, newVal, turtle);
  });

  gui.add(lsys, 'xBranchProb', 0, 1).onChange(function(newVal) {
    clearScene(turtle);
    lsys.xBranchProb = newVal;
    lsys.bBranchProb = 1 - newVal;
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'bBranchProb', 0, 0.7).onChange(function(newVal) {
    clearScene(turtle);
    lsys.bBranchProb = newVal;
    lsys.xBranchProb = 1 - newVal;
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(turtle, 'width', 0, 0.25).onChange(function(newVal) {
    clearScene(turtle);
    turtle.clear();
    turtle = new Turtle(turtle.scene);
    turtle.updateWidth(newVal);
    turtle.renderSymbols(lsys.lSystemLL);
  });
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  var obj;
  for( var i = turtle.scene.children.length - 1; i > 3; i--) {
      if(turtle.scene.children[i].name.substring(0, 6) != "flower")
      {
          obj = turtle.scene.children[i];
        turtle.scene.remove(obj);
      }
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
    if(time == 1)
    {
        doLsystem(lsys, lsys.iterations, turtle);
    }
    var cycle = time%400;
    for(var i = -6; i <= 0; i++)
    {
      for(var j = -3; j <= 3; j++)
      {
          var f = framework.scene.getObjectByName("flower" + i + j);
          
          if(f !== undefined)
          {
            if(cycle == 0)
            {
              f.position.set(f.position.x-40, f.position.y+40, f.position.z);
            }
            else
            {
              f.position.set(f.position.x + 0.1, f.position.y - 0.1, f.position.z);
              var rando = Math.floor(Math.random()*3);
              var rando2 = Math.floor(Math.random()*3);
              f.rotation.x += rando*3.1415/24;
              f.rotation.y += rando2*3.1415/24;
            }
          }
      }
    }
    time++;
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
