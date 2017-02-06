export class Node {
	constructor(symbol) {
		this.symbol = symbol;
		this.prev = null;
		this.next = null;
	}

	setPrev(prev) {
		this.prev = prev;
	}

	setNext(next) {
		this.next = next;
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