// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
/***************************************************/
/**************** LINKED LIST CLASS ****************/
/***************************************************/
function Node = {
	this.prev: null;
	this.next: null;
	this.val: null;

	setVals: function (a, b, c) {
        this.prev = a;
        this.next = b;
        this.val = c;
    }
};

function LinkedList() {
    this.head = null;

    /***** link two nodes together symmetrically *****/
    linkFirstThenSecond: function (a, b) {
        a.next = b;
        b.prev = a;
    }

    /***** expand one node into more depending on rule *****/ 
    // A function to expand one of the symbol nodes of the linked list by replacing it with several new nodes.
    // node: node being inserted (listing of nodes that will replace char)
    // char: character that the listing of nodes will replace bc of the rule chosen for this iteration
    expandNode: function (node, char) {
    	var begOfInsert = node;
    	var temp = node;
    	while (temp.next != null) {
    		temp = temp.next;
    	}
    	var endOfInsert = temp;
    	// now have begOfInsert and endOfInsert for easy insertion

    	
    	if (this.head == null) {
    		// case 1: current list has no items
    		this.head = node;
    	} else {
    		// case 2: current list has no items
	    	var onNode = this.head;

	    	while (onNode != null) {
	    		if (onNode.val == char) {
	    			var nextN = onNode.next;
	    			var prevN = onNode.prev;

	    			onNode = node;

	    			// finishing linking back to orig list
	    			if (nextN != null) {
	    				linkFirstThenSecond(endOfInsert, nextN);
	    			}
	    			if (prevN != null) {
	    				linkFirstThenSecond(prevN, onNode);
	    			}
	    		}
	    	} //end: while onNode != null

    	} //end: this.head == null / != null
    }//end: expandNode method


};
/**************** end: LINKED LIST CLASS ****************/



// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();

	var working = input_string;

	var onNode = ll.head;
	while (working.length > 0) {
		var char = working.substring(0,1);
		var n = new Node();

		n.val = char;

		if (ll.head == null) {
			ll.head = n;
		} else {
			ll.linkFirstThenSecond(onNode, n);
		}

		// steps for iteration
		// iterate current pointer node
		onNode = n;
		// iterate working string so ignore prev parts
		working = working.substring(1);
	}

	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";

	var onNode = linkedList.head;
	while (onNode != null) {
		result += onNode.val;
		onNode = onNode.next;
	}


	return result;
}

// TODO: Given the node/char to be replaced, 
// insert a sub-linked-list that represents replacementString
// into the whole list
function replaceNode(linkedList, node, replacementString) {
	// looking for nodes of this value
	var char = node.val; 
	// nodes to replace given node
	var listOfReplacement = stringToLinkedList(replacementString); 

	// expands all the nodes properly
	linkedList.expandNode(listOfReplacement.head, char);

	return linkedList;
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FX";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(0.0, '[-FX][+FX]');
	];
	// adding in my rules -HB
	this.grammar['F'] = [
		new Rule(0.1, '--XA++XF');
	];
	this.grammar['A'] = [
		new Rule(0.3, '-C+[ABC]+XF');
	];
	this.grammar['B'] = [
		new Rule(0.2, '-CX++[FA]');
	];
	this.grammar['C'] = [
		new Rule(0.4, 'B+[XC]--AF');
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

	// This function should look at the list of rules associated with the symbol in the linked list’s grammar
    // dictionary, then generate a uniform random number between 0 and 1 in order to determine which of the Rules
    // should be used to expand the symbol node. You will refer to a Rule’s probability and compare it to your random
    // number in order to determine which Rule should be chosen.
    // note: the random part is done in do iterations in Lsystem.
	this.doIterations = function(n) {	
		// set up for iterations
		// var lSystemLL = StringToLinkedList(this.axiom);

		if (n == 0) {
			return StringToLinkedList(this.axiom);
		} 

		var i = 0;
		var list = StringToLinkedList(this.axiom);
		while (i < n) {
			// pick current rule for this iteration	
			var rand = (Math.floor(Math.random() * 5.0)) / 10.0; // bc only 5 items but between 0 and 1
			var currChar;
			if (rand == 0) {
				currChar = 'X';
			} else if (rand == .1) {
				currChar = 'F';
			} else if (rand == .2) {
				currChar = 'A';
			} else if (rand == .3) {
				currChar = 'B';
			} else if (rand == .4) {
				currChar = 'C';
			} else {
				console.log("ERROR: GOT RAND VALUE THAT DOESNT MAP TO A RULE");
				currChar = null;
			}

			replaceNode(list, new Node(null, null, currChar), this.grammar[currChar].successorString);

			//iterate
			i++;	
		}
		
		return list;
	}
}