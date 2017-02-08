// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
function Node(symbol) {
    this.symbol = symbol;
    this.next = null;
    this.prev = null;
}

function LinkedList() {
	this.head = null;
	this.length = 0;

	//adds the node to end of linkedlist
	this.add = function(node) {
		var currentNode = this.head;
		if (currentNode === null) {
	        this.head = node;
	        this.length++;
	        return;
	    }
	    while (currentNode.next != null) {
	        currentNode = currentNode.next;
	    }
	    currentNode.next = node;
	    node.prev = currentNode;
	    this.length++;
	}
}

// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	for (var i = 0; i < input_string.length; i++) {
		var n = new Node(input_string[i]);
		ll.add(n);
	}
	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	if (linkedList.length != 0) {
		var currentNode = linkedList.head;
		while (currentNode != null) {
			result = result + currentNode.symbol;
			currentNode = currentNode.next;
		}
	}
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	
	var prevNode;
	var nextNode;

	//check if node to replace is the only node on the list
	if (node.prev === null && node.next == null) {
		prevNode = null;
		nextNode = null;
	}
	//check if node to replace is head of list
	else if (node.prev === null) {
		prevNode = null;
		nextNode = node.next;
	}
	//check if node to replace is tail of list
	else if (node.next === null) {
		prevNode = node.prev;
		nextNode = null;
	}
	else {
		prevNode = node.prev;
		nextNode = node.next;
	}

	//create a chain of notes given replacement string
	var newStartNode = new Node(replacementString[0]);
	var newEndNode = newStartNode;
	for (var i = 1; i < replacementString.length; i++) {
		var tempNode = new Node(replacementString[i]);
		newEndNode.next = tempNode;
		tempNode.prev = newEndNode;
		newEndNode = tempNode;
	}

	if (prevNode == null && nextNode == null) {
		linkedList.head = newStartNode;
	}
	//replaced node that is at head of list
	else if (prevNode == null) {
		linkedList.head = newStartNode;
		newEndNode.next = nextNode;
		nextNode.prev = newEndNode;
	}
	//replaced node that is at tail of list
	else if (nextNode == null) {
		prevNode.next = newStartNode;
		newStartNode.prev = prevNode;
	}
	else {
		prevNode.next = newStartNode;
		newStartNode.prev = prevNode;
		newEndNode.next = nextNode;
		nextNode.prev = newEndNode;
	}

	linkedList.length += replacementString.length - 1.0;
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	//F[aR][aR][aR][aR]
	this.axiom = "X";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(1.0, 'F[XS][+XS][&+XS][&&+XS][&&&+XS][&&&&+XS]')
		//new Rule(0.33, 'F[+XS][-XS][FXS]'),
		//new Rule(0.33, 'F[-XS][+XS][FXS]'),
		//new Rule(0.34, 'F[[XS][+XS]][+XS][-XS]')
	];
	this.grammar['F'] = [
		new Rule(1.0, 'FF')
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
		var lSystemLL = stringToLinkedList(this.axiom);

		var count = 0;
		while (count < n) {
			//iterate through the current linked list
			for(var currentNode = lSystemLL.head; currentNode != null; ) {
				
				var nextNode = currentNode.next;
				var symbol = currentNode.symbol;

				//iterate through the grammar to find matching symbol
				for (var key in this.grammar) {
					
					if (symbol === key) {
						var seed = Math.random();
						var sumProbability = 0.0;
						//iterate through the rules for the symbol, using probability to pick a rule
						for (var i = 0; i < this.grammar[key].length; i++) {
							var rule = this.grammar[key][i];
							sumProbability += rule.probability;
							if (seed <= sumProbability) {
								replaceNode(lSystemLL, currentNode, rule.successorString);
							}
						}
					}
					
				}

				currentNode = nextNode;
	        }
	        count++;
    	}
        
        console.log(linkedListToString(lSystemLL));
		return lSystemLL;
	}
}