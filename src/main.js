
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var settings = {
    lines: true,
    angle: 90.0
};
var turtle;
var numRules = 7;
var rules = {
    0: {Rule: "X=[RX+T]RX+T", Prob: 1.0},
    1: {Rule: "R=-R", Prob: 1.0},
    2: {Rule: "R=+R", Prob: 1.0},
    3: {Rule: "R=zR", Prob: 1.0},
    4: {Rule: "R=ZR", Prob: 1.0},
    4: {Rule: "R=yR", Prob: 1.0},
    4: {Rule: "R=YR", Prob: 1.0},
    5: {Rule: "R=T", Prob: 1.0},
    6: {Rule: "R=A", Prob: 1.0},
    // 7: {Rule: "R=P", Prob: 0.5},
};
var removeable_items = [];

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
  turtle = new Turtle(scene, undefined, settings);

  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
      console.log("iters")
     clearScene(turtle);
     doLsystem(lsys, newVal, turtle);
  });

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.UpdateAxiom(newVal);
    clearScene(turtle);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(settings, 'angle', 30, 90).onChange(function() {
      lsys.UpdateRules(rules);
      clearScene(turtle);
      doLsystem(lsys, lsys.iterations, turtle);
      console.log("set: "+settings.angle);
  });

  var addRuleFunc = { addRule:function(){
      rules[numRules] = {
          Rule: "",
          Prob: 1.0
      };

      var ritem = gui.add(rules[numRules], 'Rule').onChange(function() {
          lsys.UpdateRules(rules);
          clearScene(turtle);
          doLsystem(lsys, lsys.iterations, turtle);
      });
      var pitem = gui.add(rules[numRules], 'Prob', 0.0, 1.0).onChange(function() {
          lsys.UpdateRules(rules);
          clearScene(turtle);
          doLsystem(lsys, lsys.iterations, turtle);
      });
      numRules++;
      removeable_items.push(ritem);
      removeable_items.push(pitem);
  }};
  gui.add(addRuleFunc,'addRule');

  gui.add(settings, 'lines').onChange(function(newVal) {
      clearScene(turtle);
      doLsystem(lsys, lsys.iterations, turtle, newVal);
  });

  for (var i = 0; i < numRules; i++) {
      var updateRules = rate_limit(function() {
          lsys.UpdateRules(rules, i);
          clearScene(turtle);
          doLsystem(lsys, lsys.iterations, turtle);
      });

      var ritem = gui.add(rules[i], 'Rule').onChange(function() {
          lsys.UpdateRules(rules);
          clearScene(turtle);
          doLsystem(lsys, lsys.iterations, turtle);
      });
      var pitem = gui.add(rules[i], 'Prob', 0.0, 1.0).onChange(function() {
          lsys.UpdateRules(rules);
          clearScene(turtle);
          doLsystem(lsys, lsys.iterations, turtle);
      });
      removeable_items.push(ritem);
      removeable_items.push(pitem);
  }

  // update scene
  lsys.UpdateRules(rules, i);
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
    var result = lsystem.DoIterations(iterations);
    turtle.clear();
    turtle = new Turtle(turtle.scene, undefined, settings);
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

function rate_limit(func) {
    var running = false;
    var next = undefined;

    function onDone() {
        running = false; // set the flag to allow the function to be called again
        if (typeof next !== 'undefined') {
            callFunc(next); // call the function again with the queued args
        }
    }

    function callFunc(args) {
        if (running) {
            // if the function is already running, remember the arguments passed in so we can call the func with them after we're ready
            next = args;
        } else {
            running = true; // prevent other function calls from running until we're done
            next = undefined;
            func.apply(func, args); // call the func with the arguments
        }
    }

    // return a new function wrapping the function we want to rate limit
    return function() {
        // we use the same arguments but add the onDone callback as the last argument
        var args = new Array(arguments.length + 1);
        for (var i = 0; i < arguments.length; ++i) {
            args[i] = arguments[i];
        }
        args[arguments.length] = onDone;
        callFunc(args);
    }
}


// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
