// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// LSystemNode class: allows us to store additional information about each grammar symbol
// and we avoid the overhead of creating/destroying strings (like in traditional LSystem implementations)
class LSystemNode {
		constructor() {
			this.next = null;
			this.prev = null;
			this.grammarSymbol = null;
		}
		
		// Append a node to this one
		appendNode(nextNode) {
			this.next = nextNode;
			if(nextNode !== null) {
				nextNode.prev = this;
			}
		}
		
		// Prepend a node to this one
		prependNode(prevNode) {
			this.prev = prevNode;
			if(prevNode !== null) {
				prevNode.next = this;
			}
		}
		
		// Replace this node with another linked list
		replaceNode(replacementLinkedList) {
			if(replacementLinkedList.head === null) {
				return;
			} else {
				//Prepend the linked list with this node's previous
				replacementLinkedList.prependNode(this.prev);
				
				//Append the linked list with this node's next
				replacementLinkedList.appendNode(this.next);
			}
		}
		
	}


//Linked List class that allows us to store LSystemNode
class LinkedList {
	constructor() {
		this.head = null; // pointer to the first LSystemNode in this list
		this.tail = null; // pointer to the last LSystemNode in this list
	}
	
	appendNode(node) {
		if(this.head === null) {
			this.head = node;
			this.tail = node;
		} else {
			this.tail.appendNode(node);
			this.tail = node;
		}
	}
	
	prependNode(node) {
		if(this.head === null) {
			this.head = node;
			this.tail = node;
		} else {
			this.head.prependNode(node);
			this.head = node;
		}
	}
}


// Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	
	// Traverse the string
	for(var i = 0; i < input_string.length; i++) {
		var lSysNode = new LSystemNode();
		lSysNode.grammarSymbol = input_string.charAt(i);
		ll.appendNode(lSysNode);
	}
	return ll;
}

// Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	
	// Traverse the linked list
	var currentNode = linkedlist.head;
	while(currentNode !== null) {
		result += currentNode.grammarSymbol;
		currentNode = currentNode.next;
	}
	return result;
}

// Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	var replacementLinkedList = stringToLinkedList(replacementString);
	node.replaceNode(replacementLinkedList);
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
	
	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	
		var lSystemLL = stringToLinkedList(this.axiom);
		if(n == 0) {
			return lSystemLL;
		} else {
			//Apply a rule to each grammar symbol in the linked list
			for(var i = 0; i < n; i++) {
				var currentNode = lSystemLL.head;
				while(currentNode !== null) {
					
					//Get the array of possible rules to apply to this grammar symbol
					var rule = this.grammar[currentNode.grammarSymbol];
					if(typeof rule !== "undefined") {
						var ruleLL;
						
						//Randomly choose which rule to use
						var randRuleNum = Math.random(); // returns a number [0, 1)
						var runningProbability = 0; // add each successive rule's probablitity up and continually compare to randRuleNum
						for(var r = 0; r < rule.length; r++) {
							var currentRule = rule[r];
							runningProbability += currentRule.probability - 0.001; // Offset slightly so the rand probability isn't considered equal to the current probability
							if(randRuleNum < runningProbability) {
								ruleLL = stringToLinkedList(currentRule.successorString);
								break;
							}
						}
						currentNode.replaceNode(ruleLL);
					}
					currentNode = currentNode.next;
				}
			}
			return lSystemLL;
		}
	}
}