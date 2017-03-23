// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
function LinkedList(first, last)
{
	this.firstNode = first;
	this.lastNode = last;
}

class Node {

  constructor(symbol, next, prev, iter) 
  {
    // if we want to access these later, we need to bind them to 'this'
    this.next = next;
    this.prev = prev;
    this.symbol = symbol;
    this.num = iter;
  }

  setNext(newNext) 
  {
    this.next = newNext;
    newNext.prev = this;
  }

}

// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string, iter) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var head = new Node(input_string.substring(0, 1), null, null, iter);
	var lastNode = head;
	for(var i = 1; i < input_string.length; i++)
	{
		var currNode = new Node(input_string.substring(i, i+1), null, null, iter);
		lastNode.setNext(currNode);
		lastNode = currNode;
	}
	var tail = lastNode;
	// console.log(head);
	// console.log(tail);
	var newll = new LinkedList(head, tail)
	// console.log(newll);
	return newll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	var currNode = linkedList.firstNode;
	result = currNode.symbol;
	while(currNode.next != null)
	{
		currNode = currNode.next;
		result = result + currNode.symbol;
	}
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {

	var first = node.prev;
	var last = node.next;

	if(first == null)
	{
		linkedList.firstNode = replacementString.firstNode;
	}
	else 
	{
		first.setNext(replacementString.firstNode);
	}

	if(last == null)
	{
		linkedList.lastNode = replacementString.lastNode;	
	}
	else
	{
		replacementString.lastNode.setNext(last);
	}
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "TFFFFX";
	this.xBranchProb = 0.75;
	this.bBranchProb = 0.25;
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(this.xBranchProb-0.3, '[--<<F[+<C]<FX][->>FX][++<<F[->C]>FX][+<FX]'),
		new Rule(0.3, '[++<F<FX][+>>FX][-->>F[+>C]<FX]'),
		new Rule(this.bBranchProb, '[<F[+<C]B][->FB][+>>FB]')
	];
	this.grammar['B'] = [
		new Rule(0.4, '[->F>FB][+<FB[->C]][--<<FB]'),
		new Rule(0.2, '[+>[+C]FC[+C]][<<FB[+<C]][[->C]P]'),
		new Rule(0.2, '[[-C]P][[-<C]P][+>>FB[-C]]'),
		new Rule(0.2, '[+C]P')
	];
	this.iterations = 4; 
	
	// Set up the axiom string
	if (typeof axiom !== "undefined") {
		this.axiom = axiom;
	}

	// Set up the grammar as a dictionary that 
	// maps a single character (symbol) to a Rule.
	if (typeof grammar !== "undefined") {
		this.grammar = Object.assign({}, grammar);
	}
	
	// Set up iterations (the number of times you 
	// should expand the axiom in DoIterations)
	if (typeof iterations !== "undefined") {
		this.iterations = iterations;
	}

	// A function to alter the axiom string stored 
	// in the L-system
	this.updateAxiom = function(axiom) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}

	// TODO
	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	
		this.lSystemLL = stringToLinkedList(this.axiom, n);
		for(var i = n-1; i >= 0; i--)
		{
			var currNode = this.lSystemLL.firstNode;
			while(currNode != null)
			{
				var rules = this.grammar[currNode.symbol];
				var rando = Math.random();
				var lastProb = 0.0;
				var index = 0;
				if(rules != undefined)
				{
					while(rando >= rules[index].probability+lastProb)
					{
						lastProb += rules[index].probability;
						index++;
					}
					replaceNode(this.lSystemLL, currNode, stringToLinkedList(rules[index].successorString, i));
				}				
				currNode = currNode.next;
			}
		}
		return this.lSystemLL;
	}
}