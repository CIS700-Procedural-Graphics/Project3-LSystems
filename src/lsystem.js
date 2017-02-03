// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

export class ListNode {
	constructor(data) {
		this.prev = null;
		this.next = null;
		this.data = data;
	}
}

export class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
	}

	add(node) {

		if (!this.tail) {
			this.head = node;
			this.tail = node;

			return;
		}

		node.prev = this.tail;
		this.tail.next = node;
		this.tail = node;
	}

	addAt(index, node) {
		let n = this.head;
		let i = 0;

		while (n) {
			if (i == index) {
				let prev = n.prev;
				let next = n;

				node.prev = prev;
				prev.next = node;
				node.next = next;
				next.prev = node;

				// TODO:
				// Add to beginning and end

				return;
			}

			n = n.next;
			i++;
		}

		throw new Error('Unable to add node at this index');
	}

	removeAt(index) {
		let n = this.head;
		let i = 0;

		if (index == 0) {
			this.head = n.next;
			n.prev = null;
		}

		while (n) {
			if (i == index) {
				let prev = n.prev;
				let next = n.next;

				if (prev) {
					prev.next = next;
				}

				if (next) {
					next.prev = prev;
				}

				return;
			}

			n = n.next;
			i++;
		}

		throw new Error('Unable to remove node at this index');
	}

	getAt(index) {
		let n = this.head;
		let i = 0;

		while (n) {
			if (i == index) {
				return n.data;
			}

			n = n.next;
			i++;
		}

		throw new Error('Unable to get node at this index');
	}

	clear() {
		this.head = null;
		this.tail = null;
	}

	size() {
		let n = this.head;
		let i = 0;

		while (n) {
			i++;
			n = n.next;
		}

		return i;
	}

	print() {
		let n = this.head;
		let ret = [];

		while (n) {
			ret.push(n.data);
			n = n.next;
		}

		return ret;
	}
}

// TODO: Turn the string into linked list
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
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