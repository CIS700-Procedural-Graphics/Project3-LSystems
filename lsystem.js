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
	this.age = 0;
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
		 //console.log(A.symbol);
		 //console.log(B.symbol);
		if(this.length===1)
			insertEnd(B);
		else {
			B.prev=A;
			B.next=A.next;
			if(A.next !== null)
				A.next.prev=B;
			A.next=B;
			this.length++;
		}
	}

	deleteNode(N)
	{
// console.log(N.symbol);
// console.log(N.prev);
// console.log(N.next);
		if(this.length!==0)
		{
			//console.log("inside");
			if(this.length===1)
			{
				//console.log("inside 1");
				this.head = null;
				this.tail = null;
				this.length = 0;
			}
			else
			{
				//console.log("inside 2");

				if(N.prev!== null)
				{
					//console.log("inside 2.1");
					N.prev.next=N.next;
				}
				if(N.next!== null)
				{
					//console.log("inside 2.2");
					N.next.prev=N.prev;
				}
				this.length--;
			}
		}
	}

	// Creates a Node with value value at the tail
	insertEnd(gram) {
    var node = new Node(gram);
		//console.log(node.symbol);
    if (this.length!=0) {
        this.tail.next = node;
        node.prev = this.tail;
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

		//var sym=N.symbol;
		//console.log(grammar.X[0].successorString);
		if(grammar[N.symbol]!=undefined)
		{
			console.log(grammar.X[0].successorString);
			if(N.symbol==='F')
			{
				var ran=Math.random();
				for(var i=0; grammar.F[i]!==undefined; i++)
				{
					if(grammar.F[i].probability>=ran)
						replaceNode(this,N,grammar.F[i].successorString);
					else
						ran-=grammar.F[i].probability;
				}
			}
			else if(N.symbol==='X')
			{
				var ran=Math.random();
				for(var i=0; grammar.X[i]!==undefined; i++)
				{
					if(grammar.X[i].probability>=ran)
						replaceNode(this,N,grammar.X[i].successorString);
					else
						ran-=grammar.X[i].probability;
				}
			}
			else if(N.symbol==='A')
			{
				var ran=Math.random();
				for(var i=0; grammar.A[i]!==undefined; i++)
				{
					if(grammar.B[i].probability>=ran)
						replaceNode(this,N,grammar.A[i].successorString);
					else
						ran-=grammar.A[i].probability;
				}
			}
			else if(N.symbol==='B')
			{
				var ran=Math.random();
				for(var i=0; grammar.B[i]!==undefined; i++)
				{
					if(grammar.B[i].probability>=ran)
						replaceNode(this,N,grammar.B[i].successorString);
					else
						ran-=grammar.B[i].probability;
				}
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
	//console.log(input_string);
	for(var i=0; i<input_string.length; i++)
	{
		ll.insertEnd(input_string.slice(i,i+1));
		 //console.log(ll.head.symbol);
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
	//console.log(result);
	return result;
}

// PSEUDOCODE DONE
// TODO: Given the node to be replaced,
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	// console.log("------------------------------");
	// console.log(linkedListToString(linkedList));
	// console.log(replacementString);
	// console.log(node.symbol);

	var newlist = stringToLinkedList(replacementString);
	// var addnext=newlist.head;
	// var nodelast=node;
	// var addnextnext=null;
	//console.log(replacementString);

	// for(var i=0; i<replacementString.length; i++)
	// {
	// 	addnextnext=addnext.next;
	// 	newlist.addNext(nodelast,addnext);
	// 	nodelast=addnext;
	// 	addnext=addnextnext;
	// 	//console.log(linkedListToString(linkedList));
	// }

	if(node.next!==null)
	{
		node.next.prev=newlist.tail;
		newlist.tail.next=node.next;
	}
	else {
		linkedList.tail=newlist.tail;
	}

//console.log("here");
	//if(node.next!==null)
	node.next=newlist.head;
	newlist.head.prev=node;

	linkedList.length+=newlist.length;

	linkedList.deleteNode(node);
	//console.log("");

	//console.log("not here");
	//loop
	//delete node;
	//console.log(linkedListToString(linkedList));
	// if(node.prev!==null)
	// 	node.prev.next=node.next;
	// if(node.next!==null)
	// 	node.next.prev=node.prev;
	//delete node;
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FFFX";
	this.grammar = {};
	this.grammar['F'] = [ new Rule(1.0, 'FXFX') ];
	this.grammar['X'] = [ new Rule(1.0, 'F−A[[X]+AX]+AF[+AFX]−AX') ]; // default: '[-FX][+FX]'.. wikipedia: 'F−[[X]+X]+F[+FX]−X'
	this.grammar['A'] = [ new Rule(0.1, '[BA]') ];
	this.grammar['A'] = [ new Rule(0.3, '[AB]') ];
	this.grammar['B'] = [ new Rule(0.1, 'B[[F]A[F]A[F]A[F]A[F]A[F]A]') ];

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
		for(var i=0; i<n; i++)
		{
			console.log(i);
			var nextnode = lSystemLL.head;
			while(nextnode!==null)
			{
				nextnode.age++;
				var updatenext = nextnode.next;
				lSystemLL.expand(nextnode,this.grammar);
					//console.log("hi doit");
				nextnode = updatenext;
			}
			console.log(linkedListToString(lSystemLL));
		}

		return lSystemLL;
	}
}
