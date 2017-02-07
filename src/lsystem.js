// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
function LinkedList() {
	this.head = null;
	this.tail = null;
	this.dictionary = null; 

	this.link = function(a, b) {
		a.next = b;
		b.prev = a;
	}

	this.expand = function(node, iteration) {
		var rules = this.dictionary[node.symbol];

		// Randomly chooses the rule to expand from
		var rv = Math.random();
		var chosenRule;
		var sum = 0.0;
		if (typeof rules !== "undefined") {
			for (var i = 0; i < rules.length; i++) {
				if (rv <= sum + rules[i].probability) {
					chosenRule = rules[i];
					break;
				}
				else {
					sum += rules[i].probability;
				}
			}
			
			// Replaces node with the new list
			replaceNode(this, node, chosenRule.successorString, iteration);
		}
	}
}
function Node(sym) {
	this.next = null;
	this.prev = null;
	this.symbol = sym;
	this.iteration = 1;
}


// TODO: Turn the string into linked list 
function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	ll.head = new Node(input_string.charAt(0));
	var currNode = ll.head;
	for (var i = 1; i < input_string.length; i++) {
		var n = new Node(input_string.charAt(i));
		currNode.next = n;
		n.prev = currNode;
		currNode = currNode.next;
	}
	ll.tail = currNode;
	return ll;
}

// TODO: Return a string form of the LinkedList
function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	var currNode = linkedList.head;
	while (currNode != null) {
		result += currNode.symbol;
		currNode = currNode.next;
	}
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString, iteration) {
	// Creates a linkedlist from the rule 
	var expanded = stringToLinkedList(replacementString);
	var currNode = expanded.head;
	while (currNode != null) {
		// Store iteration for each node after replacement
		currNode.iteration = iteration;
		currNode = currNode.next;
	}
 	var next = node.next;
	expanded.tail.next = next;
	if (node.prev != null) {
		node.prev.next = expanded.head;
	}
}

function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "123";
	this.grammar = {};
	this.grammar['1'] = [
		new Rule(0.33333, 'FFA[-2]3[+3]'), 
		new Rule(0.33333, 'FFA[W2]3[Q3]'),
		new Rule(0.33333, 'FFA[R2]3[E3]')
	];
	this.grammar['2'] = [
		new Rule(0.33333, 'FAF+F-F-F[FF3][+3]-F-F3'),
		new Rule(0.33333, 'FAFQFWFWF[FF3][Q3]WFWF3'),
		new Rule(0.33333, 'FAFEFRFRF[FFF3][E3]RFRF3'),
	];
	this.grammar['3'] = [
		new Rule(0.33333, 'FF-F+F+F[2][-2]+F+FA2'), 
		new Rule(0.33333, 'FFWFQFQF[2][W2]QFQFA2'), 
		new Rule(0.33333, 'FFRFEFEF[2][R2]EFEFA2')
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
		this.iterations = n;
		var lSystemLL = stringToLinkedList(this.axiom);
		lSystemLL.dictionary = this.grammar;
		var currNode = lSystemLL.head;

		for (var i = 1; i <= this.iterations; i++) {
			var currNode = lSystemLL.head;
			while (currNode != null) {
				var next = currNode.next;
				lSystemLL.expand(currNode, i);
				currNode = next;
			}
			
		}
		console.log(lSystemLL);		
		return lSystemLL;
	}
}

export default {
	LinkedList: LinkedList,
	Lsystem : Lsystem,
	stringToLinkedList : stringToLinkedList,
	linkedListToString : linkedListToString
}