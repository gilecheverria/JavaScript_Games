/*
 * Practice with Object Oriented Programming in JavaScript
 *
 * Gilberto Echeverria
 * 2025-01-27
 */

class Data {
    #privateProperty
    constructor(info) {
        this.info = info;
        this.#privateProperty = info.length;
    }

    #privateMethod(transform) {
        return this.info.map(transform);
    }

    show() {
        console.log(`The data size is ${this.#privateProperty}`);
        console.log(this.info);
    }

    showModified(transform) {
        let modified = this.#privateMethod(transform);
        console.log(modified);
    }
}

let test = new Data([1, 2, 3, 4]);
test.show();
test.showModified(n => n + 10);
// This will now work
//test.privateMethod(n => n + 10);

// EXAMPLE 2

class Temperature {
    constructor(celsius) {
        this.celsius = celsius;
    }

    get fahrenheit() {
        return this.celsius * 9 / 5 + 32;
    }

    set fahrenheit(value) {
        this.celsius = (value - 32) * 5 / 9;
    }

    static fromFahrenheit(value) {
        return new Temperature((value - 32) / 1.8);
    }
}

console.log('== Temperature class ==')

let temp = new Temperature(22);
console.log(temp.fahrenheit);
temp.fahrenheit = 86;
console.log(temp.celsius);

let temp2 = Temperature.fromFahrenheit(71.6);
console.log(temp2.celsius);


// EXAMPLE 3
// Using an iterator inteface to be able to use loop constructions
// To do this, we need to define a symbol called 'iterator', which 
// provides an iterator object

class List {
    constructor(value, rest) {
        this.value = value;
        this.rest = rest;
    }

    get length() {
        return 1 + (this.rest ? this.rest.length : 0);
    }

    static fromArray(array) {
        let result = null;
        for (let i=0; i<array.length; i++) {
            result = new List(array[i], result);
        }
        return result;
    }

    [Symbol.iterator]() {
        return new ListIterator(this);
    }
}

console.log(`EX 4: Length list`);
console.log('== Linked lists ==')

let small = new List(5, null);
console.log(small.length);
let large = List.fromArray([5, 3, 6, 8, 4, 1]);
console.log(large.length);

class ListIterator {
    constructor(list) {
        this.list = list;
    }

    next() {
        if (this.list == null) {
            return {done: true};
        }
        let value = this.list.value;
        this.list = this.list.rest;
        return {value, done: false};
    }
}

// This can be used to modify a class after its creation
//List.prototype[Symbol.iterator] = function() {
//    return new ListIterator(this);
//}

let list = List.fromArray([33, 44, 55, 66, 77, 88, 99])
//for (let elem of list) {
//    console.log(elem);
//}

// The ... operator also uses the Iterator iterface
console.log(...list);

// EXAMPLE 4
// Inheritance

class LengthList extends List {
    #length;

    constructor(value, rest) {
        super(value, rest);
        this.#length = super.length;
    }

    get length() {
        return this.#length;
    }
}

console.log(`EX 4: Length list`);
console.log(LengthList.fromArray([44, 33, 22]).length);

// EXAMPLE 5
// A replica of the Set class

class Group {
    #data = [];

    add(item) {
        if (!this.#data.includes(item)) {
            this.#data.push(item);
        }
    }

    delete(item) {
        if (this.has(item)) {
            this.#data = this.#data.filter(i => i !== item);
        }
    }

    has(item) {
        return (this.#data.includes(item));
    }

    at(index) {
        if (index > -1 && index < this.#data.length) {
            return this.#data[index];
        }
    }

    get length() {
        return this.#data.length;
    }

    static from(array) {
        // First create an instance of the class,
        // before being able to call its methods (like 'add')
        const group = new Group();
        for (let item of array) {
            group.add(item);
        }
        return group;
    }

    [Symbol.iterator]() {
        return new GroupIterator(this);
    }
}

class GroupIterator {
    constructor(group) {
        this.group = group;
        this.index = 0;
    }

    next() {
        if (this.index == this.group.length) {
            return {done: true};
        }
        let value = this.group.at(this.index);
        this.index++;
        return {value, done: false};
    }
}

console.log(`EX 5: Group class`);
let group = Group.from([3, 2, 54, 6]);
group.add(4);
group.add(6);
console.log(...group);
console.log(group.has(4));
console.log(group.has(5));
console.log(`Length: ${group.length}`)
group.delete(6);
console.log(group.has(6));

console.log(...group);
