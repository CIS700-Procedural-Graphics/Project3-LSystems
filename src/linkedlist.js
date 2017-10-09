export class Node {
	constructor(symbol, iter) {
		this.symbol = symbol;
		this.prev = null;
		this.next = null;
		
		if(iter) {
			this.iteration = iter;
			// console.log("iter " + iter);
		} else {
			this.iteration = 0;
		}
	}

	setPrev(prev) {
		this.prev = prev;
	}

	setNext(next) {
		this.next = next;
	}

	setIteration(iter) {
		this.iter = iter;
	}
}

export class LinkedList {
	constructor() {

	}

	addNode(node) {
		if (this.tail) {
			this.tail.setNext(node);
			node.setPrev(this.tail);
			node.setNext(null);
			this.tail = node;
		} else {
			this.head = node;
			this.tail = node;
		}
	}
}

export default {
	Node: Node,
	LinkedList: LinkedList
}