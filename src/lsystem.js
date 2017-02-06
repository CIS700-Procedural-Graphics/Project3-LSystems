// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

function Node(){
	this.symbol ='';
	this.next = null;
	this.prev = null;
}

function Node(symbol){
	
	if (typeof symbol !== "undefined"){
		this.symbol = symbol;
	}
}

function LinkedList(){
	this.head = null;
	this.tail = null;
	this.size = 0;
}

//insert node_b after node_a
function insertAfterLinkedList(linkedList, node_a, node_b){
	node_b.next = node_a.next;
	node_a.next = node_b;
	node_b.prev = node_a;
	linkedList.size ++;
}

function addLastLinkedList(linkedList, node){
	if (linkedList.head ==  null){
		linkedList.head = node;
		linkedList.tail = node;
		linkedList.size++;
		return;
	}
	//if nonempty linkedlist, add to the end
	linkedList.tail.next = node;
	node.prev = linkedList.tail;
	linkedList.tail = node; //update the tail
	linkedList.size++;
}

export function testLinkedList(){
	
	var gram = {};
	gram['X'] = [
		new Rule(1.0, '[-FX][+FX]')
	];
	var ls = new Lsystem("FX", gram, 1);


	// var ll = stringToLinkedList("[-FX][+FX]");
	// console.log(ll);

	// var ll = stringToLinkedList(ls.axiom);
	// ll = ls.doIteration(ll);
	// console.log(linkedListToString(ll));
	// ll = ls.doIteration(ll);
	// console.log(linkedListToString(ll));

	//console.log(ll);
	//console.log(ls.doIteration(ll));
	console.log(linkedListToString(ls.doIterations(0)));
	console.log(linkedListToString(ls.doIterations(1)));
	console.log(linkedListToString(ls.doIterations(2)));
	console.log(linkedListToString(ls.doIterations(3)));


}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup

// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	for (var i = 0; i < input_string.length; i++){
		addLastLinkedList(ll, new Node(input_string[i]));
	}
	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"

	var result = "";
  	var tmp_node = linkedList.head;
    while(tmp_node != null){
    	result += tmp_node.symbol;
        tmp_node = tmp_node.next;
    }
	return result;
}

function nodesEqual(node1, node2){
	if (typeof node1 !== "undefined" &&
		typeof node2 !== "undefined") {

		return (node1.symbol == node2.symbol);
	}else{
		return false;
	}

}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {

	var tmp_node = linkedList.head;
	while(tmp_node != null){
        
        if (tmp_node == null){return;}

        if (nodesEqual(tmp_node, node)){
        	var replacementLL = stringToLinkedList(replacementString);

		    if (tmp_node.prev != null){
		    	replacementLL.head.prev = tmp_node.prev;
		    	tmp_node.prev.next = replacementLL.head;    	
		    }else{
		    	linkedList.head = replacementLL.head;
		    }

		    if (tmp_node.next != null){
		    	tmp_node.next.prev = replacementLL.tail;
		    	replacementLL.tail.next = tmp_node.next;
		    }else{
		    	linkedList.tail = replacementLL.tail;
		    }

		    linkedList.size += replacementLL.size - 1;
        }

    	tmp_node = tmp_node.next;

    }

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

	this.doIteration = function(origLL){

		var symbolsSeen = [];
		var newLL = stringToLinkedList(linkedListToString(origLL));
		var tmp_node = origLL.head;

		while(tmp_node != null){//iterate through all nodes of ORIGINAL

		var symbol = tmp_node.symbol;

		//only replace the node if we haven't seen it and there's a rule
		if (symbol in this.grammar && symbolsSeen.indexOf(symbol) == -1){
			//replace the character if we have a rule in our grammer
			var replacementString = this.grammar[symbol][0].successorString;
			replaceNode(newLL, new Node(symbol), replacementString);
			symbolsSeen.push(symbol);
		}
		
		tmp_node = tmp_node.next;
		
		}

		return newLL;
	}

	this.doIterations = function(n) {	
		
		var lSystemLL = stringToLinkedList(this.axiom);
		
		for (var i = 0; i < n; i ++){ //do the replacement n times

			lSystemLL = this.doIteration(lSystemLL);
		}
		
		return lSystemLL;
	}
}