
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {linkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

//OBJ Loading
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);

var turtle;
var leafGeometry;

// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // initialize a simple box and material
  var spotlight = new THREE.SpotLight( 0xffffff, 1, 500, Math.PI / 3, 0.5, 1.75 );
  spotlight.color.setHSL(0.1, 1, 0.95);
  spotlight.position.set(1 * 20, 2 * 20, 2 * 20);
  spotlight.castShadow = true;
  
  //Set up shadow and shadow camera properties
  spotlight.shadow.mapSize.width = 4096 * 2;
  spotlight.shadow.mapSize.height = 4096 * 2;
  spotlight.shadow.camera.near = 1;
  spotlight.shadow.camera. far = 200;
  
  scene.add(spotlight);
  
  // var helper = new THREE.CameraHelper(spotlight.shadow.camera);
  // scene.add(helper);
  
  // set skybox
  var loader = new THREE.CubeTextureLoader();
  var urlPrefix = '/res/images/skymap/';

  var skymap = new THREE.CubeTextureLoader().load([
      urlPrefix + 'px.jpg', urlPrefix + 'nx.jpg',
      urlPrefix + 'py.jpg', urlPrefix + 'ny.jpg',
      urlPrefix + 'pz.jpg', urlPrefix + 'nz.jpg'
  ] );
  scene.background = skymap;
  
  //Add the ground plane
  var planeGeometry = new THREE.PlaneGeometry(750, 750);
  var planeMaterial = new THREE.MeshPhongMaterial( {color: 0x778899, side: THREE.DoubleSide} );
  planeMaterial.shininess = 5; //default 30
  var planeMesh = new THREE.Mesh( planeGeometry, planeMaterial );
  planeMesh.rotateX(90 * Math.PI / 180);
  planeMesh.position.set(0, -0.01, 0);
  planeMesh.receiveShadow = true;
  scene.add(planeMesh);
  
  // set camera position
  camera.position.set(18.5, 27, 8);
  camera.lookAt(new THREE.Vector3(0,0,0));
  
  // set the global doLSys object with this lsystem
  doLSys.lsystem = new Lsystem;
  
  // initialize the turtle to draw our l-system
  turtle = new Turtle(scene);
  
  loadOBJ(leafGeometry);
  
  // give the turtle to the global doLSys object
  doLSys.turtle = turtle;
    
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(doLSys.lsystem, 'axiom').onChange(function(newVal) {
    doLSys.lsystem.updateAxiom(newVal);
  });
  
  gui.add(doLSys, 'iterations', 0, 12).step(1);
  
  gui.add(doLSys, 'doLSystem').name('Do L-System');
  
}

function loadOBJ(leafGeometry) {
    OBJLoader = new THREE.OBJLoader();
    OBJLoader.load('/res/OBJs/leaf.obj', function(obj) {
        leafGeometry = obj.children[0].geometry;
    });
    // console.log(this.leafGeometry); //undefined here
}

function setTurtleOBJ(turtle) {
  turtle.leafGeometry = leafGeometry;
}

// clears the scene by removing all geometries added by turtle.js
function clearScene(turtle) {
  var obj;
  for( var i = turtle.scene.children.length - 1; i > 4; i--) {
      obj = turtle.scene.children[i];
      turtle.scene.remove(obj);
  }
}

var doLSys = {
	lsystem : null,
	iterations : 0,
	turtle : null,
	doLSystem : function() {
			clearScene(this.turtle);
    		var result = this.lsystem.doIterations(this.iterations);
    		this.turtle.clear();
    		this.turtle = new Turtle(this.turtle.scene);
        setTurtleOBJ(this.turtle);
    		this.turtle.renderSymbols(result);
		}
};

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
