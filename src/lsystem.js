import LinkedList from './linkedlist.js'

// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// Implement a linked list class and its requisite functions
// as described in the homework writeup
// See linkedlist.js

// Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();

	for (var i = 0; i < input_string.length; i++) {
		ll.push(input_string.charAt(i));
	}

	return ll;
}

// Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	return linkedList.toString();
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	if (linkedList === null || linkedList.head === null || node === null) {
		// If LL doesn't exist or is empty just return
		return;
	}
	
	var curr = linkedList.head;

	// Replacement string is empty
	// Basically remove node at evey appearance
	if (!replacementString || replacementString.length == 0) {
		// Delete the node at every appearance
		while (curr != null) {
			if (linkedList.head == linkedList.tail) {
				// 1 Element Case

				if (linkedList.head.value == node.value) {
					linkedList.pop(); // remove
				}

				return;
			}


			// Current is the head
			else if (curr == linkedList.head) {
				if (curr.value == node.value) {
					linkedList.head = linkedList.head.next;
					curr = linkedList.head;
				}
			}

			// Current is the tail
			else if (curr == linkedList.tail) {
				if (curr.value == node.value) {
					linkedList.tail = linkedList.tail.prev;
				}

				return;
			}

			// Current is a middle node
			else if (curr.value == node.value) {
				var before = curr.prev;
				var after = curr.next;

				// Drop reference to current node
				before.next = after;
				after.prev = before;

				curr = after;
			}

			// Move on
			else {
				curr = curr.next;
			}
		}

	// ReplacementString is not empty
	} else {
		// Create LL of replacementString
		var rsll = stringToLinkedList(replacementString);

		if (linkedList.head == linkedList.tail) {
			// 1 Element Case
			// Replace LL with RSLL
			if (linkedList.head.value == node.value) {
				linkedList = rsll;
			}

			return;
		}


		// 2+ Element cases
		// Curr is currently equal to the head
		if (curr.value == node.value) {
			var copy = rsll.clone();

			copy.tail.next = linkedList.head.next;
			linkedList.head = copy.head;
		}

		// Loop through the LL
		while(curr !== null) {

			// Current is the tail
			else if (curr == linkedList.tail) {
				if (curr.value == node.value) {
					linkedList.tail = linkedList.tail.prev;
				}

				return;
			}

			// Current is a middle node
			else if (curr.value == node.value) {
				var before = curr.prev;
				var after = curr.next;

				// Drop reference to current node
				before.next = after;
				after.prev = before;

				curr = after;
			}

			if (curr.value == node.value) {
				// Replace
				var before = curr.prev;
				var after = curr.next;

				// Copy the replacementString LinkedList
				var copy = rsll.clone();
				copy.head.prev = before;
				copy.tail.next = after;

				before.next = copy.head;
				after.prev = copy.tail;

				// Update current
				curr = after;
			} else {
				// Keep going otherwise
				curr = curr.next;
			}
		}
	}
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