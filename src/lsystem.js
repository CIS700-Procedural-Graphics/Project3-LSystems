// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
function LinkedList() {
	this.head = undefined;
	this.tail = undefined;
}

function LinkedListNode() {
	this.character = '';
	this.prev = undefined;
	this.next = undefined;
}

// TODO: Turn the string into linked list
export function StringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();

	switch (input_string.lenth) {
		case 0:
			console.log("StringToLinkedList: input length 0");
			break;
		default:
			console.log("StringToLinkedList: parsing");
			var prev = undefined;
			for (var i = 0; i < input_string.length; i++) {
				var node = new LinkedListNode();
				node.character = input_string.charAt(i);
				node.prev = prev;
				if (prev) {
					prev.next = node;
				}
				prev = node;

				if (i == 0) {
					ll.head = node;
				}

				if (i == input_string.length - 1) {
					ll.tail = node;
				}

				console.log(node.character);
			}
			break;
	}

	return ll;
}

// TODO: Return a string form of the LinkedList
export function LinkedListToString(linkedList) {
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
	this.UpdateAxiom = function(axiom) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}

	this.UpdateRules = function(rules) {
		this.grammar = {};
		for (var key in rules) {
			var entry = rules[key];
			var prob = entry.Prob;
			var data = entry.Rule.replace(/\s/g, "").split("=");
			if (data.length == 2) {
				var symbol = data[0];
				var rule = data[1];
				var R = new Rule(prob, rule);
				if (!this.grammar[symbol]) {
					this.grammar[symbol] = [];
				}
				this.grammar[symbol].push(R);
			} else {
				console.log("Invalid Rule: " + key);
			}
		}
		console.log(this.grammar);
	}

	// TODO
	// This function returns a linked list that is the result
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.DoIterations = function(n) {
		console.log("start iterations");
		var lSystemLL = StringToLinkedList(this.axiom);
		console.log("end iterations");
		return lSystemLL;
	}
}
