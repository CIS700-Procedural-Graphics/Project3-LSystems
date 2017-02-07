// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
var Node = function(str, i) {
	this.next = null;
	this.prev = null;
	this.sym = str;
	this.iter = i; //what iteration node was added
}

var LinkedList = function() {
	this.size = 0;
	this.head = null;
	this.tail = null;
}

LinkedList.prototype.append = function(str, iter) {
	var n = new Node(str, iter);
	this.size++;
	if (this.tail == null) {
		this.head = n; this.tail = n;
		return;
	}
	n.prev = this.tail; this.tail.next = n;
	this.tail = n;
} 

LinkedList.prototype.prepend = function(str, iter) {
	var n = new Node(str, iter);
	this.size++;
	if (this.head == null) {
		this.head = n; this.tail = n;
		return;
	}
	n.next = this.head; this.head.next = n;
	this.head = n;
}

LinkedList.prototype.combine = function(l1, l2) {
	var list = new LinkedList();
	list.head = l1.head;
	list.tail = l2.tail;
	l1.tail.next = l2.head;
	l2.head.prev = l1.tail;
	list.size = l1.size + l2.size;
	return list;
}

// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string, iter) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var list = new LinkedList();
	for (var i = 0; i < input_string.length; i ++) {
		var c = input_string.charAt(i); list.append(c, iter);
	}
	return list;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	var n = linkedList.head;
	while (n != null) {
		result += n.sym; n = n.next; 
	}
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
// ASSUMING REPLACEMENT IS NOT EMPTY
function replaceNode(linkedList, node, replacementString, iter) {

	var sub = stringToLinkedList(replacementString, iter);
	
	if (node.prev == null && node.next == null) {
		linkedList.head = sub.head;
		linkedList.tail = sub.tail;
		linkedList.size = sub.size; 
		return;
	}
	if (node.prev == null) {linkedList.head = sub.head;} 
	else {node.prev.next = sub.head; sub.head.prev = node.prev;}
	if (node.next == null) {linkedList.tail = sub.tail;} 
	else {node.next.prev = sub.tail; sub.tail.next = node.next;}
	linkedList.size += sub.size - 1;
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = 'AX';
	this.grammar = {};
	this.grammar['X'] = [new Rule(1.0, 'BY')];
	this.grammar['Y'] = [new Rule(1.0, 'CZ')];
	this.grammar['Z'] = [new Rule(1.0, 'DU')];
	this.grammar['U'] = [new Rule(0.25, '[FQ*]>FU'),
							new Rule(0.25, '[FQ]<FU'),
							new Rule(0.25, '[(FU][)FQ*]'),
							new Rule(0.25, 'FQ')];
	this.grammar['Q'] = [new Rule(0.25, '^FU'), 
							new Rule(0.75, 'vF#U')];
	this.iterations = 3; 
	this.result = new LinkedList();
	
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

	this.updateGrammar = function(str, new_str, prob) {
		if (this.grammar[str] == null) this.grammar[str] = [ new Rule(prob, new_str)]; 
		else {
			this.grammar[str].push(new Rule(prob, new_str));
			this.grammar[str].sort(function(a, b) {return a.probability - b.probability;})
		}
	}

	this.selectRule = function(str) {
		var x = Math.random();
		var i = 0;
		var sum = this.grammar[str][i].probability;
		while (x > sum) {
			i = i +1;
			var rule = this.grammar[str][i];
			sum += this.grammar[str][i].probability;
		}
		return this.grammar[str][i].successorString;
	}

	// TODO
	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(num) {	
		var lSystemLL = stringToLinkedList(this.axiom, -1);
		for (var i = 0; i < num; i++) {
			var nod = lSystemLL.head;
			// debugger;
			while (nod != null) {
				if (this.grammar[nod.sym] != null) {

					var new_str = this.selectRule(nod.sym);
					replaceNode(lSystemLL, nod, new_str, i + 1);

				}
				nod = nod.next;
			}
		}
		this.result = lSystemLL;
		return lSystemLL;
	}
}