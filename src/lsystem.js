// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

//TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
function Node(symbol){
	this.prev = null;
	this.next = null;
	this.symbol = symbol;
}

export class LinkedList {
	//var grammar=
	constructor() {
			this.head = null;
			this.tail = null;
			this.length = 0;
	}

	//ADDS B NEXT TO A
	addNext(A,B) {
    //var node = new Node(value);
		if(this.length==1)
			insertEnd(B);
		else {
			B.prev=A;
			B.next=A.next;
			A.next.prev=B;
			A.next=B;
		}
	}

	// Creates a Node with value value at the tail
	insertEnd(gram) {
    var node = new Node(gram);
		//console.log(node.symbol);
    if (this.length!=0) {
        this.tail.next = node;
        node.previous = this.tail;
        this.tail = node;
    } else {
        this.head = node;
        this.tail = node;
    }
		this.length++;
	}

	// expands node N
	expand(N,grammar){
		//N.symbol
		var ran=Math.random();
		console.log(grammar[N.symbol]);
		if(grammar[N.symbol]!=undefined)
		{
			if(grammar[N.symbol].Rule.probability>=ran)
			{
				var str = grammar[N.symbol][0][1];
				replaceNode(this,N,str);
				console.log("expanded");
			}
			else{
				console.log("skipped");
			}
		}
	}
}

// DONE - UNTESTED
// TODO: Turn the string into linked list
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	for(var i=0; i<input_string.length; i++)
	{
		ll.insertEnd(input_string.slice(i,i+1));
		// console.log(ll.tail.symbol);
	}
	return ll;
}

// DONE - UNTESTED
// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var nextnode = linkedList.head;
	var result = "";
	while(nextnode!==null)
	{
		result+=nextnode.symbol;
		nextnode=nextnode.next;
	}
	return result;
}

// PSEUDOCODE DONE
// TODO: Given the node to be replaced,
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	var newlist = stringToLinkedList(replacementString);
	var addnext=newlist.head;
	var addnextnext=null;
	for(var i=0; i<replacementString.length; i++)
	{
		addnextnext=addnext.next;
		addNext(node,addnext);
		addnext=addnextnext;
	}
	//loop
	//delete node;
	node.prev.next=node.next;
	node.next.prev=node.prev;
	//delete node;
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
		console.log("grammar updated");
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
		//console.log("hi doit");
		for(var i=0; i<2; i++)
		{
			var nextnode = lSystemLL.head;
			while(nextnode!==null)
			{
				var updatenext = nextnode.next;
				lSystemLL.expand(nextnode,this.grammar);
					//console.log("hi doit");
				nextnode = updatenext;
			}
		}
		console.log(linkedListToString(lSystemLL));
		return lSystemLL;
	}
}
