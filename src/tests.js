import { ListNode, LinkedList } from './lsystem.js'

var list = new LinkedList();
list.add(new ListNode(0));
list.add(new ListNode(1));
list.add(new ListNode(2));
list.addAt(3, new ListNode(0.5));

console.log(list.print());
console.log(list.size());