// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// An instruction is essentially a symbol with logic, context, stack and (TODO) parameters
class LInstruction
{
	symbol() { return "A"; }
	evaluate(context, stack) { return context; }
}

class ForwardInstruction extends LInstruction 
{  
	symbol() { return "F"; }

	evaluate(context, stack) {
		return context;
	}
}

// Dummy instructions can be anything, they are used for replacement
class DummyInstruction extends LInstruction 
{
	constructor(symbol) { super(); this.dummySymbol = symbol; }

	symbol() { return this.dummySymbol; }

	evaluate(context, stack) {
		return context;
	}
}

class PushInstruction extends LInstruction 
{  
	symbol() { return "["; }

	evaluate(context, stack) {
	stack.push(context);
		return context;
	}
}

class PullInstruction extends LInstruction
{
	symbol() { return "]"; }

	evaluate(context, stack) {
		return stack.pop(context);
	}
}

class RotatePositiveInstruction extends LInstruction
{
	symbol() { return "+"; }

	evaluate(context, stack) {
		return context;
	}
}


class RotateNegativeInstruction extends LInstruction
{
	symbol() { return "-"; }

	evaluate(context, stack) {
		return context;
	}
}

// A grammar chain is a doubly linked list of instructions
// that can be modified by given rules
class LInstructionChain 
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
    var contextStack = [];
    var context = { position: 0, angle : 0 };

    this.evaluateInternal(function(node) {
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
    this.evaluateInternal(function(node) { result += node.value.symbol(); } );
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

  // Because we're expanding in-place, we must be careful not to 
  // expand recently added nodes that come from a previous replacement
  // in the same expansion cycle.
  expand(rules, clean)
  {
    if(clean)
      this.iterate(null, null, function(node){node.new = false;});

    for(var r = 0; r < rules.length; r++)
    {
      var nodes = this.findAll(rules[r].predecessor());

      for(var n = 0; n < rules.length; n++)
        if(nodes[n].new == false)
          this.replace(nodes[n], rules[r].successor())
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

class LRule 
{
	probability() { return 1.0; }	

	// The symbol to replace
	predecessor() { return new LInstruction(); }

	// The list of symbols that are placed instead
	successor() { return [new LInstruction(), new LInstruction()]; }
}

export default function LSystem(axiom, grammar, iterations) 
{
	this.registerInstruction = function(instruction)
	{
		this.instructionMap[instruction.symbol()] = instruction;
	}

	this.getInstruction = function(symbol) 
	{
		if(!(symbol in this.instructionMap))
			console.error("Symbol " + symbol + " not present in instruction map!");

		return this.instructionMap[symbol];
	}

	this.parseAxiom = function(axiomSymbols) 
	{
		this.chain = new LInstructionChain();

		for(var i = 0; i < axiomSymbols.length; i++)
			this.chain.push(this.getInstruction(axiomSymbols[i]));
	}

	this.updateAxiom = function(axiom) 
	{
		this.axiom = axiom;
		this.parseAxiom(axiom);
	}

	this.grammar = {};
	this.grammar['X'] = [
		new Rule(1.0, '[-FX][+FX]')
	];
	this.iterations = iterations;
	this.instructionMap = {};
	this.chain = new LInstructionChain();

	// Register common instructions
	this.registerInstruction(new PushInstruction());
	this.registerInstruction(new PullInstruction());
	this.registerInstruction(new ForwardInstruction());
	this.registerInstruction(new DummyInstruction("X"));
	this.registerInstruction(new RotateNegativeInstruction());
	this.registerInstruction(new RotatePositiveInstruction());
	
	this.updateAxiom(axiom);	

	// Set up the grammar as a dictionary that 
	// maps a single character (symbol) to a Rule.
	if (typeof grammar !== "undefined") {
		this.grammar = Object.assign({}, grammar);
	}
	
	// TODO
	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	
		var lSystemLL = StringToLinkedList(this.axiom);
		return lSystemLL;
	}
}