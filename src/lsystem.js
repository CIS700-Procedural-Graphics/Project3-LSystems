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

// Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
// WASN'T SUPPOSED TO GO THROUGH THE ENTIRE LOOP I THINK.
// WHAT HAVE YOU DONE ELLEN LMAO.
function replaceNode(linkedList, node, replacementString) {
	if (linkedList === null || linkedList.head === null || node === null) {
		// If LL doesn't exist or is empty just return
		return;
	}

	// Replacement string is empty
	// Basically remove node at evey appearance
	if (!replacementString || replacementString.length == 0) {
		// Delete the node at every appearance
		
		// 1 Element Case
		if (linkedList.head == linkedList.tail && linkedList.head == node) {
			linkedList.pop(); // remove
		}

		// Node is the head
		else if (node == linkedList.head) {
			linkedList.head = linkedList.head.next;
			linkedList.head.prev = null;
		}

		// Node is the tail
		else if (node == linkedList.tail) {
			linkedList.tail = linkedList.tail.prev;
			linkedList.next =  null;
		}

		// Node is a middle node
		// Or doesn't exist in the linked list, but well hopefully the function
		// is used properly. And I mean, I'm going to used it properly...
		else {
			var before = node.prev;
			var after = node.next;

			// Drop reference to node
			before.next = after;
			after.prev = before;
		}
	// ReplacementString is not empty
	} else {
		// Create LL of replacementString
		var rsll = stringToLinkedList(replacementString);

		// 1 Element Case
		if (linkedList.head == linkedList.tail && linkedList.head == node) {
			// Replace LL with RSLL
			linkedList = rsll;
			return;
		}


		// 2+ Element cases
		// If node is the head
		if (node == linkedList.head) {
			var after = linkedList.head.next;

			// Attach copied RSLL, skipping head
			rsll.tail.next = after;
			after.prev = rsll.tail; // update prev

			// Update LL head
			linkedList.head = rsll.head; // prev is already null
		} 

		// If node is the tail
		else if (node == linkedList.tail) {
			var before = linkedList.tail.prev;

			// remove node (which is the tail) and add pointer to next
			before.next = rsll.head;
			rsll.head.prev = before; 

			// Update tail pointer
			linkedList.tail = rsll.tail;
		}

		// Node is a middle node
		// Or doesn't exist in the linked list, but well hopefully the function
		// is used properly. And I mean, I'm going to used it properly...
		else {
			// Replace
			var before = node.prev;
			var after = node.next;

			// rsll the replacementString LinkedList
			rsll.head.prev = before;
			rsll.tail.next = after;

			// update the pointers in the linked list
			before.next = rsll.head;
			after.prev = rsll.tail;
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
		// If there isn't an axiom, then just return
		if (this.axiom == null || this.axiom.length <= 0) {
			return;
		}

		var lSystemLL = StringToLinkedList(this.axiom);

		// Iterate n times
		for (var i = 0; i < n; i++) {
			var curr = lSystemLL.head;

			while (curr != null) {
				var curr_grammar = this.grammer[curr.value];

				if (curr_grammar) {
					replaceNode(lSystemLL, curr, curr_grammar);
				}

				curr = curr.next;
			}
		}

		return lSystemLL;
	}
}