// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
function Node(grammarSymbol) {
    this.symbol = grammarSymbol;
	this.param = [];
	this.cond = null;
	/*this.cond = function (s , min) {
		return s >= min;
	};*/
    this.previous = null;
    this.next = null;
}
 
function LinkedList() {
    this.head = null;
    this.tail = null;
	this.rotation = 30;
}

LinkedList.prototype.setSym = function (nodeA, nodeB) {
	if (nodeA)
		nodeA.next = nodeB;
	if (nodeB)
		nodeB.prev = nodeA;
}


LinkedList.prototype.printParameter = function () {
	
	var temp = this.head;
	var str = "";
	while (temp) {
		
		str += (temp.symbol);
		if (temp.symbol == 'A') {
			
			str += "(" + temp.param[0] + "," + temp.param[1] + ")";
		}
		
		else if (temp.symbol != '[' && temp.symbol != ']') {

			str += "(" + temp.param[0] + ")";
		}
		
		
		//str += ("-->");	
		temp = temp.next;
	}
	
	console.log(str);

}

LinkedList.prototype.print = function () {
	
	var temp = this.head;
	var str = "";
	while (temp) {
		
		str += (temp.symbol);
		//str += ("-->");	
		temp = temp.next;
	}
	
	console.log(str);

}

LinkedList.prototype.printReversed = function () {
	
	var temp = this.tail;
	var str = "";
	while (temp) {
		
		str += (temp.symbol);
		//sstr += ("-->");	
		temp = temp.prev;
	}
	
	console.log(str);

}

// replaceNode(linkedList, node, replacementString)
LinkedList.prototype.expand = function (node, grammar) {
	
	var rules = grammar[node.symbol];
	
	if (rules) {
		
		var r = Math.random();
		var selectedRule = rules[0];
		
		
		for (var i = 0; i < rules.length; i++) {

			if (rules[i].probability >= r) {
				selectedRule = rules[i];
			}
		}
		
		
		replaceNode(this, node, selectedRule.successorString);
	}
	
}


LinkedList.prototype.expandParameter = function (node) {
	
	
	if (node.symbol != "A")
		return;
	
	var r1 = 0.8;
	var r2 = 0.8;
	var alpha1 = 30.0;
	var alpha2 = -30.0;
	var phi1 = 137.0;
	var phi2 = 137.0;
	var q = 0.5;
	var e = 0.5;
	var min = 0.0;
	var n = 10;
	var s = node.param[0];
	var w = node.param[1];
	
	var str = "!";
	str += "(" + w + ")"; //w
	str += "F(" + s + ")"; //s
	str += "[+(" + alpha1 + ")";
	str += "/(" + phi1 + ")";	
	str += "A(" + s * r1 + "," + w * Math.pow(q,e) + ")]";	

	str += "[+(" + alpha2 + ")";
	str += "/(" + phi2 + ")";	
	str += "A(" + s * r2 + "," + w * Math.pow(1.0-q,e) + ")]";	
	//console.log(str);
	
	replaceNode(this, node, str);
}

LinkedList.prototype.addNode = function(node) {
 
    if (this.head != null) {
        this.tail.next = node;
        node.prev = this.tail;
        this.tail = node;
    } else {
        this.head = node;
        this.tail = node;
    }
  
    return node;
};
 
LinkedList.prototype.add = function(value) {
    var node = new Node(value);
 
    if (this.head != null) {
        this.tail.next = node;
        node.prev = this.tail;
        this.tail = node;
    } else {
        this.head = node;
        this.tail = node;
    }
  
    return node;
};

// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	
	for (var i = 0, len = input_string.length; i < len; i++) {
  		ll.add(input_string[i]);
	}
	
	return ll;
}

export function stringParameterToLinkedList(input_string) {
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is 
	// at Node('F') and the tail is at Node('X')	
	
	//console.log(input_string);
	var str = input_string.replace(/ *\([^)]*\) */g, ""); //strip out params
	var params = input_string.match(/ *\([^)]*\) */g); //save params	
	//var str2 = "!(w)F(s)[+(30)/(137)A(12,23)][+(-30)/(137)A(22,110)]";
	//var myArray = input_string.match(/ *\([^)]*\) */g);
	//console.log(myArray);
	
	var ll = new LinkedList();
	var offset = 0;
	
	for (var i = 0; i < str.length; i++)
	{
		var node = new Node(str[i]);
		
		if (str[i] == '[' || str[i] == ']') {
			
			offset++;
			ll.addNode(node);
			
		} 
		else if (str[i] != 'A') {
			
			var re = /\(([+-]?\d+\.?\d*)\).*/; 
			var symbolParams = params[i-offset].match(re); //get params
			
			for (var j = 0; j < symbolParams.length-1; j++) {
				node.param[j] = symbolParams[j+1]
			}
			
			ll.addNode(node);		
		} 
		else {
			
			var re = /\(([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)\)/; 
			var symbolParams = params[i-offset].match(re); //get params
			
			for (var j = 0; j < symbolParams.length-1; j++) {
				node.param[j] = symbolParams[j+1]
			}
			node.cond = 's >= 0';
			
			ll.addNode(node);			
		}
	}
	
	//console.log(ll);
	
	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	
	var temp = linkedList.head;
	
	while(temp.next) {
		
		result+= temp.symbol;
		temp = temp.next;
	}
	
	return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
	
	if (replacementString == "")
		return;
	
	var subLinkedList = stringToLinkedList(replacementString);
	//var subLinkedList = stringParameterToLinkedList(replacementString);

	//if node is head
	if (node.prev == null) {
		
		linkedList.setSym(subLinkedList.tail, linkedList.head.next);		
		linkedList.head = subLinkedList.head;
		
	} else if (node.next == null) { //node is tail
				
		linkedList.setSym(linkedList.tail.prev, subLinkedList.head);		
		linkedList.tail = subLinkedList.tail;
		
	} else { //node is in middle of list
		
		linkedList.setSym(node.prev, subLinkedList.head);
		linkedList.setSym(subLinkedList.tail, node.next);		
	}
	
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	//this.axiom = "A(100.0,30.0)";
	this.rotation = 30.0;
	this.axiom = "X";
	this.grammar = {};
	this.grammar['X'] = [
		new Rule(1.0, 'F[+XS]F[-/XS]+X')
		//new Rule(0.5, 'F[-XS]F[+&XS]+X')
	];
	this.grammar['F'] = [
		new Rule(1.0, 'F')
	];
	/*this.grammar['X'] = [
		new Rule(1.0, '[-FX][+FX]')
	];*/
	/*this.grammar['X'] = [
		new Rule(1.0, '+v[GY]v[GY]v[GY]'),
		//new Rule(1.0, '-v[+GY]v[+GY]v[+GY]')
	];
	
	this.grammar['Y'] = [
		new Rule(1.0, 'v[GY]v[HZ]')
	];
	
	this.grammar['Z'] = [
		new Rule(1.0, '[+wJZ][+wwJZ][+wwwJZ]')
	];*/
	
	
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
	
	this.updateRotation = function(rotation) {
		// Setup axiom
		if (typeof rotation !== "undefined") {
			this.rotation = rotation;
		}
	}
	
	// TODO
	// This function returns a linked list that is the result 
	// of expanding the L-system's axiom n times.
	// The implementation we have provided you just returns a linked
	// list of the axiom.
	this.doIterations = function(n) {	
		var lSystemLL = stringToLinkedList(this.axiom);
		lSystemLL.rotation = this.rotation;
		//var lSystemLL = stringParameterToLinkedList(this.axiom);

		var temp = n;
		while (n > 0) {
			
			var temp = lSystemLL.head;
	
			while(temp) {

				var next = temp.next;
				
				var node = lSystemLL.expand(temp, this.grammar);
				//var node = lSystemLL.expandParameter(temp, this.grammar);

				
				temp = next;
			}			
			n--;	
		}
		//lSystemLL.printParameter();
		//lSystemLL.print();
	
		return lSystemLL;
	}
}