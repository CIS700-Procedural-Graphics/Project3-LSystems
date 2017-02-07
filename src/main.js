
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
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
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene);

  ////// gui
  
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.updateAxiom(newVal);
    clearScene(turtle);
    console.log('in gui onChange axiom');
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
	if( lsys.prevIterations == lsys.iterations )
		return; //avoid running this twice per gui change. don't know why it happens.
    clearScene(turtle);
    console.log('in gui onChange iterations');
    doLsystem(lsys, newVal, turtle);
    lsys.prevIterations = lsys.iterations;
  });
  
  var rules=['X','Y','Z'];
  rules.forEach( function(el) {
  	var ruleArr = lsys.grammar[el];
  	var f = gui.addFolder('Rule '+el);
  	for( var i=0; i < ruleArr.length; i++ ){
  		var name = 'Sub '+i;
	  	f.add(ruleArr[i], 'successorString').name(name);
	  	f.add(ruleArr[i], 'probability', 0.0, 1.0).step(0.1).name(name+' prob');
	}
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
	console.log('=========== doLsystem ============ ');
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
