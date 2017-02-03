'use strict';

var _lsystemJs = require('./lsystem.js');

var list = new _lsystemJs.LinkedList();
list.add(new _lsystemJs.ListNode(0));
list.add(new _lsystemJs.ListNode(1));
list.add(new _lsystemJs.ListNode(2));
list.addAt(3, new _lsystemJs.ListNode(0.5));

console.log(list.print());
console.log(list.size());