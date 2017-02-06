// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
	this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
	this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup

class LinkedListNode {
  constructor(val, gen) {
    this.val = val;
		this.gen = gen;
  }
}

class LinkedList {
  constructor() {
  }

  push(val, gen) {
    let node = new LinkedListNode(val, gen);
    this.pushNode(node);
    return this;
  }

  find(val) {
    let it = this.head;
    while(it) {
      if (it === val) {
        return it;
      }
      it = it.next;
    }
  }

  findAll(val, gen) {
    let it = this.head;
    let result = [];
    while(it) {
      if (it.val === val && it.gen === gen) {
        result.push(it);
      }
      it = it.next;
    }
    return result;
  }

  remove(val) {
    let node = this.find(val);
    if (node) {
      this.removeNode(node);
    }
  }

  pushNode(node) {
    if (!this.tail) {
      this.head = node;
      this.tail = this.head;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = this.tail.next;
    }
    return this;
  }

  popLeft() {
    if (!this.head) {
      return;
    }
    let ret = this.head;
    this.head = this.head.next;
    return ret;
  }

  removeNode(node) {
    if (node.prev && node.next) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    } else if (node.prev) {
      node.prev.next = undefined;
    } else if (node.next) {
      node.next.prev = undefined;
    }
    return this;
  }
}

// TODO: Turn the string into linked list
export function stringToLinkedList(str) {
	let ll = new LinkedList();
  for (let i = 0; i < str.length; i++) {
    ll.push(str[i], 0);
  }
	return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(ll) {
	let it = ll.head;
  let result = "";
  while(it) {
    result += it.val;
    it = it.next;
  }
	return result;
}

// TODO: Given the node to be replaced,
// insert a sub-linked-list that represents replacementString
function replaceNode(ll, node, replace) {
	console.log(node, replace);
  if (replace.length < 1) {
    return ll.removeNode(node);
  }
  let rest = node.next;
  let it = node;
  node.val = replace[0];
  for (let i = 1; i < replace.length; i++) {
    it.next = new LinkedListNode(replace[i]);
    it = it.next;
  }
  it.next = rest;
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
	this.doIterations = function(n) {
		let lsystem = stringToLinkedList(this.axiom);
		let keys = Object.keys(this.grammar);
		for(let g = 0; g < n; g++) {
			for(let i = 0; i < keys.length; i++) {
				let rule = keys[i];
				let nodes = lsystem.findAll(rule, g);
				let successors = this.grammar[rule];
				for (let j = 0; j < nodes.length; j++) {
					let random = Math.random();
					let prob = 0;
					for (let k = 0; k < successors.length; k++) {
						prob += successors[k].probability;
						if (random > prob) {
							replaceNode(lsystem, nodes[j], successors[k].successorString);
							break;
						}
					}
				}
			}
		}


		console.log(linkedListToString(lsystem));
		return lsystem;
	}
}
