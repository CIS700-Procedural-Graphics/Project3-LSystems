// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

/*****************************************************************************/
/**************** VAR OF WHICH SCENE BEING BUILT: WHICH RULES ****************/
/*****************************************************************************/
var tree = 0
/**************** end:VAR OF WHICH SCENE BEING BUILT: WHICH RULES ****************/

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
/***************************************************/
/**************** LINKED LIST CLASS ****************/
/***************************************************/
function Node(p, n, v) {
	this.prev = p;
	this.next = n;
	this.character = v;
};

function LinkedList() {
    this.head = null;

    /***** link two nodes together symmetrically *****/
    this.linkFirstThenSecond = function(a, b) {
    	if (a != null) {
    		a.next = b;
    	}
        if (b != null) {
        	b.prev = a;
        }
        return;
    }

    /***** expand one node into more depending on rule *****/ 
    // A function to expand one of the symbol nodes of the linked list by replacing it with several new nodes.
    // node: node being inserted (listing of nodes that will replace char)
    // char: character that the listing of nodes will replace bc of the rule chosen for this iteration
    // onNode: current node being expanded
    //
    // returns node/null corresponding to whatever follows the last node added as the injected node sequence
    this.expandNode = function(onNode, node, char) {
    	var begOfInsert = node;
    	var temp = node;

    	while (temp.next != null) {
    		temp = temp.next;
    	}
    	var endOfInsert = temp;

    	//console.log("begOfInsert: " + begOfInsert.character);
    	//console.log("endOfInsert: " + endOfInsert.character);
    	// now have begOfInsert and endOfInsert for easy insertion

    	var prev = onNode.prev;
    	var next = onNode.next;
    	this.linkFirstThenSecond(prev, begOfInsert);
    	this.linkFirstThenSecond(endOfInsert, next);

    	return begOfInsert;
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
	for (var i = 0; i < working.length; i++) {
		var char = working.charAt(i);
		var n = new Node(null, null, char);

		if (ll.head == null) {
			ll.head = n;
		} else {
			ll.linkFirstThenSecond(onNode, n);
		}

		// steps for iteration
		// iterate current pointer node
		onNode = n;
	}

	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";

	var onNode = linkedList.head;
	while (onNode != null && onNode.character != null) {
		result += onNode.character;
		onNode = onNode.next;
	}

	console.log("in linkedListToString: with output: "+ result);

	return result;
}

// TODO: Given the node/char to be replaced, 
// insert a sub-linked-list that represents replacementString
// into the whole list
function replaceNode(linkedList, char, replacementString) {
	//console.log("in replaceNode");
	//console.log("CHAR BEING REPLACED: " + char + " replacement string for char: " + replacementString);

	var onNode = linkedList.head;
	//console.log("INSERTING IN THE REPLACEMENT STRING INTO PARTICULAR NODES");
	
	while (onNode != null && onNode.character != null) {
		//console.log("onNode.character = " + onNode.character);
		if (onNode.character == char) {
			//console.log("		EXPANDING THE NODE");
			var next = onNode.next;
			var prev = onNode.prev;

			var listOfReplacement = stringToLinkedList(replacementString); 
			var returnedFromExpanded = linkedList.expandNode(onNode, listOfReplacement.head, char);
			if (onNode.prev == null) {
				linkedList.head = returnedFromExpanded;
			}
			

			onNode = next;
		} else {
			onNode = onNode.next;
		}

		//console.log("CURRENTLY HAVE THE FOLLOWING FOR AXIOM: " + linkedListToString(linkedList));
	}

	return linkedList;
}

export default function Lsystem(axiom, grammar, iterations) {

	// default LSystem
	this.begAxiom = "FX";
	this.axiom = "FX";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(0.6, "[-FX][+FX]"), // tree 0
		new Rule(0.6, "[-FX][+FX][--FX][++FX]") // tree 1
	];
	// adding in my rules -HB
	this.grammar['F'] = [
		new Rule(0.7, "AFFB[BXX]"), // tree 0
		new Rule(0.6, "[AFB]") // tree 1
	];
	this.grammar['A'] = [
		new Rule(0.4, "[-FFX[BXF]FC]FB"), // tree 0
		new Rule(0.4, "[-FFC]B") // tree 1
	];
	this.grammar['B'] = [
		new Rule(0.3, "[X+FFA]XCF"), // tree 0
		new Rule(0.3, "[X+FF]F") // tree 1
	];
	this.grammar['C'] = [
		new Rule(0.5, "XA[BXF]FX--F"), // tree 0
		new Rule(0.5, "X[AFF]X") // tree 1
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

	this.updateBegAxiom = function(axiom) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.begAxiom = axiom;
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
	this.doIterations = function(n, tree) {	
		// set up for iterations
		// var lSystemLL = StringToLinkedList(this.axiom);

		// console.log("in lsystem.doIterations: with input of n: " + n + " iterations");
		this.iterations = n;
		if (n == 0) {
			return stringToLinkedList(this.axiom);
		} 

		var i = 0;
		while (i < n) {
			var list = stringToLinkedList(this.begAxiom);
			var rand = (Math.floor(Math.random() * 5.0)) / 10.0 + 0.3; // bc only 5 items but between 0 and 1
			var currChar;
			if (rand == 0.6) {
				currChar = 'X';
			} else if (rand == 0.7) {
				currChar = 'F';
			} else if (rand == .4) {
				currChar = 'A';
			} else if (rand == .3) {
				currChar = 'B';
			} else if (rand == .5) {
				currChar = 'C';
			} else {
				console.log("ERROR: GOT RAND VALUE THAT DOESNT MAP TO A RULE");
				currChar = null;
			}

			// search for all nodes with this value and expand/replace them properly
			this.axiom = linkedListToString(replaceNode(list, currChar, this.grammar[currChar][tree].successorString));
			console.log("updated the axiom to: " + this.axiom);

			//iterate
			i++;	
			console.log("ITERATED I: " + i);
		}
		
		console.log("finished this set of doIterations");
		return list;
	}
}