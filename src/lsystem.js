// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str)
{
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule

	//you get the probability, and the replacement string, and using a condition based on that probability use the rule
	if(prob > Math.random())
	{
		//actually carry out the rule
		return str;
	}
	else
	{
		return this;
	}
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
var LinkedList = function(){
	 this.first = null; // variables first and last will not be directly accessible because theyre not bound to "this"
	 this.last =null; //even thought theyre not directly accessible, they exist

	 //The actual data held by linked list elements; used for push pop and remove but we actually return the variable LL
			var Node = function(value){
      this.grammar = value;
			// this.flag_replace = false;
      this.next = null; // next is initially just an empty object
			this.previous = null;
   };

   this.push = function(value){
      var node = new Node(value);
      if(this.first == null)
			{
         this.first = node;
				 this.last = node;
      }
			else
			{
        //  symlink(last, node);
				this.last.next = node;
				node.previous = this.last;
        this.last = node;
      }
			return node;
   };

   this.pop = function(){
      var popped_value = this.first.grammar;
      this.first = this.first.next;
      return popped_value;
   };
	 return this;
};

// TODO: Turn the string into linked list
export function StringToLinkedList(input_string)
{
	// ex. assuming input_string = "F+X"
	// you should return a linked list where the head is
	// at Node('F') and the tail is at Node('X')
	var ll = new LinkedList();
	for (var i = 0; i < input_string.length; i++)
	{
  	ll.push(input_string[i]);
	}
	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList)
{
	// ex. Node1("F")->Node2("X") should be "FX"
	var result = "";
	var current = linkedList.first;
	while (current)
	{ // while not null
		result = result + current.grammar;
    current = current.next;
	}
	return result;
}

// TODO: Given the node to be replaced,
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString)
{
	//link the previous node to the one after the current node
	var ll = StringToLinkedList(replacementString);
	if(node == linkedList.first)
	{
		console.log("replace first");
		linkedList.first = ll.first;

		node.next.previous = ll.last;
		ll.last.next = node.next;
	}
	else if(node == linkedList.last)
	{
		linkedList.last = ll.last;

		node.previous.next = ll.first;
		ll.first.prev = node.previous;
	}
	else
	{
		node.previous.next = ll.first;
		ll.first.prev = node.previous;

		node.next.previous = ll.last;
		ll.last.next = node.next;
	}
}

export default function Lsystem(axiom, grammar, iterations) {
	// default LSystem
	this.axiom = "FFF+T";
	this.grammar = {};

	//All the grammar rules
	this.grammar['X'] = [
		// new Rule(0.8, '[-FT][+FT]')
		new Rule(0.5, 'F-[[X]+X]+F[+FX]-X'),
		new Rule(0.6, 'LA'),
		new Rule(0.6, 'L'),
		new Rule(0.5, 'F+[[X]-X]-F[-FX]+X')
	];
	this.grammar['F'] = [
		new Rule(0.3, 'F')
	];
	this.grammar['T'] = [
		new Rule(0.6, '[FX][aFX][aFX][aFX][aFX][aFX][aFX][aFX][aFX]')
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
	this.DoIterations = function(n) {
		var grammar_replacement_rule_index = 0;
		var count_x = 0;
		var lSystemLL = StringToLinkedList(this.axiom);
		for(var i =0; i < n; i++)
		{
			//call replace node on every character in the string

			var temp = lSystemLL.first;

			while(temp) {
				var tempNext = temp.next;

				var grammar_symbol = temp.grammar;
				if((i >=2))
				{
					if((grammar_symbol == "X"))
					{
						grammar_replacement_rule_index++;
						var grammar_replacement_rule = this.grammar[grammar_symbol][grammar_replacement_rule_index%3];
						var grammar_replacement = grammar_replacement_rule.successorString;
						grammar_symbol = grammar_replacement;
					}
					else if((grammar_symbol == "T") || (grammar_symbol == "F"))
					{
						var grammar_replacement_rule = this.grammar[grammar_symbol][0];
						var grammar_replacement = grammar_replacement_rule.successorString;
						grammar_symbol = grammar_replacement;
					}

				}
				else if((grammar_symbol == "X") || (grammar_symbol == "T") || (grammar_symbol == "F"))
				{
					var grammar_replacement_rule = this.grammar[grammar_symbol][0];
					var grammar_replacement = grammar_replacement_rule.successorString;
					grammar_symbol = grammar_replacement;
				}

				replaceNode(lSystemLL, temp, grammar_symbol);

				temp = tempNext;
			}
		}
		return lSystemLL;
	}
}
