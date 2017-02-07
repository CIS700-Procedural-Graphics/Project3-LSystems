import { Node, LinkedList } from './linkedlist'

// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}


// Turn the string into linked list 
export function stringToLinkedList(input_string, iter) {
	var list = new LinkedList();
	var tokens = input_string.split('');
	
	var firstNode = new Node(tokens[0], iter);
	list.addNode(firstNode);
	var prev = firstNode;
	for (var i = 1; i < tokens.length; i++) {
		var curr = new Node(tokens[i], iter);
		linkNodes(prev, curr);
		list.addNode(curr);
		prev = curr;
	}

	return list;
}

// Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	var result = "";

	if(linkedList.head) {
		var n = linkedList.head;
		while(n) {
			result += n.symbol;
			n = n.next;		
		} 
	}

	return result;
}

// Symmetrically links nodeA and nodeB to each other
// nodeA's next is nodeB, nodeB's prev is nodeA
function linkNodes(nodeA, nodeB) {
	nodeA.setNext(nodeB);
	nodeB.setPrev(nodeA);
}

// Given the node to be replaced, 
// Insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString, iter) {
	var replacementList = stringToLinkedList(replacementString, iter);

	if (node.prev) {
		linkNodes(node.prev, replacementList.head);
	} else {
		linkedList.head = replacementList.head;
		linkedList.head.prev = null;
	}

	if (node.next) {
		linkNodes(replacementList.tail, node.next);
	} else {
		linkedList.tail = replacementList.tail;
		linkedList.tail.next = null;
	}

	return replacementList.tail;
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FFFX";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(0, '[+FFFFX*][-FFFF&][--FFFFX]'),
		new Rule(0, '[+FFFFX*][-FFFF&][--FFFFX]'),
		new Rule(0, '[-F&X][+F&X][--F[+++FX]&X]'),
		new Rule(1, '[-F+X][+FX-F]')
	];
	this.iterations = 0; 
	this.angle = 30;
	
	// Set up the axiom string
	if (axiom) {
		this.axiom = axiom;
	}

	// Set up the grammar as a dictionary that 
	// maps a single character (symbol) to a Rule.
	if (grammar) {
		this.grammar = Object.assign({}, grammar);
	}
	
	// Set up iterations (the number of times you 
	// should expand the axiom in DoIterations)
	if (iterations) {
		this.iterations = iterations;
	}

	// A function to alter the axiom string stored 
	// in the L-system
	this.updateAxiom = function(axiom) {
		// Setup axiom
		if (axiom) {
			this.axiom = axiom;
		}
	}

	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(iterations) {	
		var list = stringToLinkedList(this.axiom, 0);

		for(var i = 0; i < iterations; i++) {
			var n = list.head;
			while (n) {
			 	var rules = this.grammar[n.symbol];
			 	if (rules) {
			 		var rand = Math.random(); 
			 		var loBound, hiBound;

			 		for (var j = 0; j < rules.length; j++) {
			 			var pr = rules[j].probability;
			 			if (j === 0) {
			 				loBound = 0;
			 				hiBound = pr;
			 			} else {
			 				loBound = hiBound;
			 				hiBound += pr;
			 			}
			 			
			 			if (rand >= loBound && rand <= hiBound) {
			 				n = replaceNode(list, n, rules[j].successorString, i);
			 			}	
			 		}
			 	}
			 	n = n.next;
			}
		}
		return list;
	}
}