// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
export class Node {
	constructor(character, prev, next){
		this.character = character;
		this.prev = prev;
		this.next = next;
	}
}

export class LinkedList {
	constructor() {
		this.head = null;
	}
	append( node ){
		if( this.head === null ){
			this.head = node;
			return;
		}
		var n = this.head;
		var done = false;
		while( ! done ) {
			if( n.next === null ){
				n.next = node;
				return;
			}
			n = n.next;
		}
	}
}

//Find the last node in a list of node, not necessarily
// a LinkedList
export function getLastNode( firstNode ) {
	var lastNode = firstNode;
	while( lastNode.next !== null )
	  lastNode = lastNode.next;
	return lastNode;
}

// Take a string and make linked nodes,
// but not a full LinkedList.
// Returns the first node
export function stringToNodes(input_string){
	var prev = null;
	var first = null
	for( var i=0; i < input_string.length; i++ ){
		var node = new Node( input_string.charAt(i), prev, null );		
		if( first === null )
		  first = node;
		else
		  prev.next = node;
		prev = node;
	}
	return first;
}
// TODO: Turn the string into linked list 
export function StringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	ll.head = stringToNodes(input_string);
	return ll;
}

// TODO: Return a string form of the LinkedList
export function LinkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	var node = linkedList.head;
	while( node !== null ){
	  result += node.character;
	  node = node.next;
	}
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	var firstNewNode = stringToNodes( replacementString );
	firstNewNode.prev = node.prev;
	var prevNext = null;
	if( linkedList.head === node ){
		prevNext = linkedList.head.next;
		linkedList.head = firstNewNode;
	} else {
		prevNext = node.prev.next;
		node.prev.next = firstNewNode;
	}
	//point to the old node's next node
	var lastNewNode = getLastNode( firstNewNode );
	lastNewNode.next = prevNext;
	prevNext.prev = lastNewNode;
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FX";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(1.0, '[-FX][+FX]')
	];
	this.iterations = 0; 
	
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
		var lSystemLL = StringToLinkedList(this.axiom);
		/*console.log('axiom: ', this.axiom);
		console.log('lSystemLL ', lSystemLL );
		console.log('head ', lSystemLL.head );
		console.log('last ', getLastNode(lSystemLL.head) );*/
		var str = LinkedListToString(lSystemLL);
		//console.log('here');
		//console.log('lsys ll to string: ', str );
		return lSystemLL;
	}
}