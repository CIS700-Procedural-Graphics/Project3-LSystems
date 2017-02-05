// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}



// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
export class LinkedList {
	constructor() {
		this.head = null;
		this.tail = null;
		this.count = 0;
	}

	pushFront(symbol) {
		var node = {
			symbol : symbol,
			next : this.head,
			prev : null
		}

		if (this.count == 0) {
			this.head = node;
			this.tail = node;
		} else {
			this.head.prev = node;
			this.head = node;
		}

		this.count++;
	}

	pushBack(symbol) {
		var node = {
			symbol : symbol,
			prev : this.tail,
			next : null
		}

		if (this.count == 0) {
			this.head = node;
			this.tail = node;
		} else {
			this.tail.next = node;
			this.tail = node;
		}
		this.count++;
	}

	insertBetween(symbol, prev, next) {
		var node = {
			symbol : symbol,
			prev : prev,
			next : next
		}
		prev.next = node;
		next.prev = node;
		this.count++;
	}

}

// Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	//console.log(input_string);
	for (var i = 0; i < input_string.length; i++) {
		ll.pushBack(input_string.charAt(i));
	}

	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	for (var current = linkedList.head; current != null; current = current.next) {
		result += current.symbol;
	}

	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	var beforeNode = node.prev;
	var afterNode = node.next;
	//console.log(replacementString);
	var replacement = stringToLinkedList(replacementString);
	
	replacement.head.prev = beforeNode;
	replacement.tail.next = afterNode;

	if (node == linkedList.head) {
		linkedList.head = replacement.head;
	} else {
		beforeNode.next = replacement.head;
	}

	if (node == linkedList.tail) {
		linkedList.tail = replacement.tail;
	} else {
		afterNode.prev = replacement.tail;
	}


}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "MB";
	this.grammar = {};
	/*this.grammar['X'] = [
		new Rule(1.0, '[-<FX][+<FX]')
	];*/
	this.grammar['X'] = [
		new Rule(0.1, '[lFX][rFX]>FX'),
		new Rule(0.1, '[lFX][rFX]-FX'),
		new Rule(0.1, 'X'),
		new Rule(0.7, '[lFX][rFX]FX')
	];

	this.grammar['B'] = [
		new Rule(1.0, '[++++X]<<<[++++X]<<<[++++X]<<<[++++X]FFB')
	];
	this.grammar['M'] = [
		new Rule(1.0, 'MF')
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

	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	
		var lSystemLL = stringToLinkedList(this.axiom);
		// for each iteration
		for (var iter = 0; iter < n; iter++) {
			// for each symbol of the original string
			var current = lSystemLL.head;
			while(current != null) {
				var symbol = current.symbol;
				if (this.grammar[symbol] != undefined) {
					// have replacement rule

					// save position of next original node
					var newNext = current.next;

					// pick a random rule from the grammar
					var r = Math.random();
					var ruleset = this.grammar[symbol];
					var nString = ruleset[0].successorString;
					var totalProb = 0.0;
					for (var i = 0; i < ruleset.length; i++) {
						totalProb += ruleset[i].probability;
						if (r <= totalProb) {
							nString = ruleset[i].successorString;
							break;
						}
					}

					replaceNode(lSystemLL, current, nString);
					current = newNext;
				} else {
					current = current.next;
				}
			}
		}
		console.log(linkedListToString(lSystemLL));
		return lSystemLL;
	}
}