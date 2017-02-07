// A class that represents a symbol replacement rule to
// be used when expanding an L-system grammar.
function Rule(prob, str) {
    this.probability = prob; // The probability that this Rule will be used when replacing a character in the grammar string
    this.successorString = str; // The string that will replace the char that maps to this Rule
}

// TODO: Implement a linked list class and its requisite functions
// as described in the homework writeup
class Node {
    constructor(prevNode, nextNode, symbol) {
        this.prevNode = prevNode;
        this.nextNode = nextNode;
        this.symbol = symbol;
    }
    getSymbol() {
        return this.symbol;
    }
    setSymbol(newSymbol) {
        this.symbol = newSymbol;
    }
    getNext() {
        return this.nextNode;
    }
    setNext(newNext) {
        this.nextNode = newNext; 
    }
    getPrev() {
        return this.prevNode;
    }
    setPrev(newPrev) {
        this.prevNode = newPrev;
    }
    print() {
        console.log("prevSymbol " + this.prevNode.getSymbol());
        console.log("nodeSymbol " + this.getSymbol());
        console.log("nextSymbol " + this.nextNode.getSymbol());
    }
}

class LinkedList {
    constructor(startNode, grammarDictionary) {
        this.startNode = startNode;
        //this.endNode = startNode;
        this.length = 1; 
        // an object mapping symbols to an array of other symbols
        this.grammarDictionary = grammarDictionary;
    }
    // adds a node to the end of the linked list
    addNode(nodeSymbol) {
        var temp = this.startNode;
        while (this.startNode.getNext() != null) {
            temp = temp.getNext();
        }
        var newNode = Node(temp, null, nodeSymbol);
        temp.setNext(newNode);
        //this.endNode = newNode;
    }

    deleteNode(nodeToDelete) {
        var prevNode = nodeToDelete.getPrev();
        var nextNode = nodeToDelete.getNext(); 
        prevNode.setNext(nextNode);
        nextNode.setPrev(prevNode);
    }

    linkNodes(nodeA, nodeB) {
        nodeA.setNext(nodeB);
        nodeB.setPrev(nodeA);
    }

    expandNode(nodeToExpand) {
        var symbol = nodeToExpand.getSymbol();
        var replacementSymbols = this.grammarDictionary[symbol];
        if (replacementSymbols.length > 0) {
            var nullNode = Node(null, null, '');
            var prevNode = nodeToExpand.getPrev();
            var nextNode = nodeToExpand.getNext();
            this.deleteNode(nodeToExpand);
            for (var i = 0; i < replacementSymbols.length; i++) {
                var newNode = Node(nullNode, nullNode, replacementSymbols[i]);
                this.linkNodes(prevNode, newNode);
                prevNode = newNode;
                if (i == replacementSymbols.length - 1) {
                    this.linkNodes(newNode, nextNode);
                }
            }
        }
    }

    print() {
        var temp = this.startNode;
        var count = 0; 
        while (this.startNode.getNext() != null) {
            console.log(count);
            temp.print();
            temp = temp.getNext();
            count++;
        }
        count++;
        console.log(count);
        temp.print();
    } 
}


// TODO: Turn the string into linked list 
export function stringToLinkedList(input_string) {
    // ex. assuming input_string = "F+X"
    // you should return a linked list where the head is 
    // at Node('F') and the tail is at Node('X')
    var ll = new LinkedList();
    return ll;
}

// TODO: Return a string form of the LinkedList
export function linkedListToString(linkedList) {
    // ex. Node1("F")->Node2("X") should be "FX"
    var result = "";
    return result;
}

// TODO: Given the node to be replaced, 
// insert a sub-linked-list that represents replacementString
function replaceNode(linkedList, node, replacementString) {
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
        var lSystemLL = StringToLinkedList(this.axiom);
        return lSystemLL;
    }
}