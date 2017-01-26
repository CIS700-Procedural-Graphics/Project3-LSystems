function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

function Node(symbol) // Node for a linked list of grammar symbols
{
	this.next = null;
	this.prev = null;
	this.character = symbol;
}

function LinkedList()
{
	this.head = null;
	this.tail = null;
}

// TODO: Link node 1 and node 2 such that 
// node1's next is node2 and node2's prev is node1
function symmetricallyLink(node1, node2) {
}

// TODO: Applies a grammar rule of the node's character and modifies the linkedList
function ApplyRandomRule(linkedList, node, grammar) {
	var symbol = node.character;
	var rulesArray = grammar[symbol];
}

// TODO: Turn the string to linked list 
export function StringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();;
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
function ReplaceNode(linkedList, node, replacementString) {
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FX";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(1.0, '[-FX][+FX]')
	];
	this.iterations = 0; 
	
	// Setup axiom
	if (typeof axiom !== "undefined") {
		this.axiom = axiom;
	}

	// Setup grammar
	if (typeof grammar !== "undefined") {
		this.grammar = Object.assign({}, grammar);
	}
	
	// Setup iterations
	if (typeof iterations !== "undefined") {
		this.iterations = iterations;
	}

	// Update parameters
	this.UpdateAxiom = function(axiom) {
		// Setup axiom
		if (typeof axiom !== "undefined") {
			this.axiom = axiom;
		}
	}

	// TODO: Return results of lsystem after num iterations
	this.DoIterations = function(n) {	
		var lSystemLL = StringToLinkedList(this.axiom);		
		return lSystemLL;
	}
}