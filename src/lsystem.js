// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// LSystemNode class: allows us to store additional information about each grammar symbol
// and we avoid the overhead of creating/destroying strings (like in traditional LSystem implementations)

class LSystemNode {
		constructor() {
			this.next = null;
			this.prev = null;
			this.grammarSymbol = null;
		}
		
		//append a node to this one
		appendNode(nextNode) {
			this.next = nextNode;
			if(nextNode !== null) {
				nextNode.prev = this;
			}
		}
		
		//prepend a node to this one
		prependNode(prevNode) {
			this.prev = prevNode;
			if(prevNode !== null) {
				prevNode.next = this;
			}
		}
		
		//Replace this node with another linked list
		replaceNode(replacementLinkedList) {
			if(replacementLinkedList.length === 0) {
				return;
			} else { // Insert the replacement Linked List between this node and its previous
				//Prepend this node with the head of the replacement list
				replacementLinkedList.prependNode(this.prev);
				prependNode(replacementLinkedList.head);
				replacementLinkedList.appendNode(this.next);
			}
		}
		
	}


//Linked List class that allows us to store LSystemNode
class LinkedList {
	constructor() {
		this.length = 0;
		this.head = null; //pointer to the first LSystemNode in this list
		this.tail = null; //pointer to the last LSystemNode in this list
	}
	
	appendNode(node) {
		if(length === 0) {
			this.head = node;
			this.tail = node;
		} else {
			this.tail.appendNode(node);
			this.tail = node;
		}
		length++;
	}
	
	prependNode(node) {
		if(length === 0) {
			this.head = node;
			this.tail = node;
		} else {
			this.head.prependNode(node);
			this.head = node;
		}
		length++;
	}
}


// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	
	// Traverse the string
	for(var i = 0; i < input_string.length; i++) {
		LSystemNode lSysNode = new LSystemNode();
		lSysNode.grammarSymbol = input_string.charAt(i);
		ll.appendNode();
	}
	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
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
		return lSystemLL;
	}
}