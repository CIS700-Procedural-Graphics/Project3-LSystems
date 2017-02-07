
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much
import Framework from './framework'
import Lsystem, {LinkedListToString} from './lsystem.js'
import Turtle from './turtle.js'

var turtle;

class LInstruction
{
  constructor()
  {    
  }

  symbol()
  {
    return "A";
  }

  evaluate(context, stack)
  {
    // Do stuff
  }
}

// var PushInstruction = new LInstruction

// A grammar chain is a doubly linked list of instructions
// that can be modified by given rules
class GrammarChain 
{
  constructor()
  {
    this.root = null;
    this.last = null;
  }

  push(value) 
  {
    if(this.root == null)
    {
      this.root = { prev: null, next: null, value: value, new : false};
      this.last = this.root;
    }
    else if(this.last != null)
    {
      var node = { prev: this.last, next: null, value: value, new : true};
      this.last.next = node;
      this.last = node;
    }

    return this.last;
  }

  // Evaluates a chain of instructions, both with a context and a stack
  evaluate()
  {    
    contextStack = [];
    context = { position: 0, angle : 0 };

    this.evaluateInternal(function(node){
      context = node.value.evaluate(context, contextStack);
    });
  }

  evaluateInternal(evaluateFunc)
  {
    this.iterate(null, null, evaluateFunc);
  }

  // General purpose iteration function
  iterate(condition, returnFunc, evaluateFunc = null)
  {
    var node = this.root;

    while(node != null) {

      if(evaluateFunc != null)
        evaluateFunc(node);

      if(returnFunc != null && condition != null && condition(node))
        return returnFunc(node);

      node = node.next;
    }

    return null;
  }

  toString() 
  {
    var result = "";
    this.evaluateInternal(function(node) { result += node.value; } );
    return result;
  }

  findAll(value) 
  {
    var nodes = [];
    this.iterate(null, null, function(node) { if(node.value == value) nodes.push(node); });
    return nodes;
  }

  find(value) 
  {
    return this.iterate(function(node){return node.value == value;}, function(node) { return node } );
  }

  // Because we're replacing in-place, we must be careful not to 
  // replace recently added nodes that come from a previous replacement
  // in the same expansion cycle.
  expand(rules, clean)
  {
    if(clean)
      this.iterate(null, null, function(node){node.new = false;});

    for(var r = 0; r < rules.length; r++)
    {
      var nodes = this.findAll(rules[r].symbol);

      for(var n = 0; n < rules.length; n++)
        if(nodes[n].new == false)
          this.replace(nodes[n], rules[r].resultSymbols)
    }

    this.iterate(null, null, function(node){node.new = false;});
  }

  // Now it only replaces one symbol. TODO context aware rules
  replaceSymbol(v, values)
  {
    this.replace(this.find(v), values);
  }

  replace(node, values) 
  {
    if(node == null)
      return;

    var prevNode = node.prev;
    this.last = prevNode;

    if(this.root == node)
      this.root = this.last;

    for(var i = 0; i < values.length; i++)
      this.push(values[i]);

    // Reconnect the chain, while ignoring the replaced node
    if(this.last != null)
    {
      this.last.next = node.next;

      if(node.next != null)
        node.next.prev = this.last;

      // Make sure we update the last node
      while(this.last.next != null)
        this.last = this.last.next;
    }
  }
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

  gui.add(lsys, 'axiom').onChange(function(newVal) {
    lsys.UpdateAxiom(newVal);
    doLsystem(lsys, lsys.iterations, turtle);
  });

  gui.add(lsys, 'iterations', 0, 12).step(1).onChange(function(newVal) {
    clearScene(turtle);
    doLsystem(lsys, newVal, turtle);
  });


  var list = new GrammarChain();
  list.push("A");
  list.push("B");
  list.push("C");
  list.push("D");
  list.push("E");
  list.push("F");

  list.replaceSymbol("B", ["Q", "Q", "Q"]);


  list.push("H");

  console.log(list.root);

  console.log(list.toString());
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
    turtle.renderSymbols(result);
}

// called on frame updates
function onUpdate(framework) {
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);
