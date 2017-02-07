

var LinkedList = function() {
	this.head = null;
	this.tail = null;
}

LinkedList.prototype.push = function(value) {
	var node = {
		value: value,
		next: null,
		prev: null
	}

	if (this.head === null) {
		// First element
		this.head = node;
		this.tail = node;
	} else {
		// Add to end of list
		node.prev = this.tail;
		this.tail.next = node;
		this.tail = node; // Update tail
	}
}

LinkedList.prototype.pop = function(value) {
	// 0 Elements
	if (this.head === null) {
		return null;
	}

	// 1 Element
	else if (this.tail === this.head) {
		var node = this.head;
		
		this.head = null;
		this.tail = null;

		return node;
	}

	// 2+ Elements
	else {
		var node = this.tail;
		this.tail = this.tail.prev;
		this.tail.next = null;

		return node;
	}
}

LinkedList.prototype.toString = function() {
	if (this.head === null) {
		return 'empty';
	} else {
		var curr = this.head;
		var result = '';

		while (curr !== null) {
			result += curr.value;
			curr = curr.next;
		}

		return result;
	} 
}