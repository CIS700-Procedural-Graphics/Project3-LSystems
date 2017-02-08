
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
  camera.position.set(20, 14, 4);
  camera.lookAt(new THREE.Vector3(0,9,0));

  // initialize LSystem and a Turtle to draw
  var lsys = new Lsystem();
  turtle = new Turtle(scene, lsys.startingRotations);
  framework.turtle = turtle;
  
  //period of color-based segment width cycling
  framework.colorPeriod = 3000;
  
  ////// gui
  
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(framework, 'colorPeriod', 100, 12000).name('Anim Period (msec)');

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
    //console.log('in gui onChange iterations');
    doLsystem(lsys, newVal, turtle);
    lsys.prevIterations = lsys.iterations;
  });
  
  gui.add(lsys.startingRotations, '0',0,60).name('Init Rot X');
  gui.add(lsys.startingRotations, '1',0,60).name('Init Rot Y');
  gui.add(lsys.startingRotations, '2',0,60).name('Init Rot Z');
  
  var rules=['A','B','C'];
  rules.forEach( function(el) {
  	var ruleArr = lsys.grammar[el];
  	var f = gui.addFolder('Rule '+el);
  	for( var i=0; i < ruleArr.length; i++ ){
  		var name = 'Sub '+i;
	  	f.add(ruleArr[i], 'successorString').name(name);
	  	f.add(ruleArr[i], 'probability', 0.0, 1.0).step(0.1).name(name+' prob');
	}
  });


  //generate!
  clearScene(turtle);
  doLsystem(lsys, lsys.iterations, turtle);

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
    clearScene(turtle);
    var result = lsystem.doIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene, lsystem.startingRotations);
    //turtle.startingRotations = lsystem.startingRotations; //hack this in here
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
	if( turtle === undefined )
	  return;
	  
	var date = new Date();
	var time = date.getTime();
	var period = framework.colorPeriod;
	var phase = (time % period ) / period * 2 * 3.1415;
	
	//traverse nodes and change width
	turtle.scene.traverse( function (node ) {
		if ( node instanceof THREE.Mesh ) {
			//node.stateColor is a hack for getting in some iteration state info in here
			var thisPhase = phase + ( node.stateColor * 2 * 3.1415 );
			var scale = Math.sin( thisPhase ) + 1;
			scale = scale / 6 + 0.2;
			node.scale.set( scale, 1, scale );	
		}
	} );
/*	var x = Math.cos( phase ) * 4;
	var z = Math.sin (phase ) * 4;
	//console.log(time, phase, x, z);
	framework.camera.position.set( x, 0, z );
	framework.camera.lookAt(new THREE.Vector3(0,0,0));
    framework.camera.updateProjectionMatrix();*/
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
