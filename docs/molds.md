# uni molds

Molds give the entities form. They define the actions that entities may perform. They also define the signals entities may trigger.

## DEFINE

Molds are defined globally, meaning molds are accessible inside different worlds. Each mold must have a unique namespace across the application. To define a mold, use the following code:

```javascript

(function(){ //use a closure around the mold to give it a private scope
	var mold = uni.mold('meep');
})();

```

In the code above, there is a function closure around the mold. This is used to give the mold it's own variable scope - reducing global scope pollution and variable collisions. Inside the closure is a command that initilizes a new mold `meep` and stores it into the variable `mold`.

## INHERITANCE

Molds may inherit actions from other molds. To do this, first define the mold to be inherited from and then use the following code:

```javascript

mold.inherit('foo');

```

Use the code above inside the closure and after the mold has been defined. The command above will allow the mold to inherit thw actions of the mold `foo`.

## ACTIONS

Once a mold is defined, actions may be added to that mold. A full mold definition with actions will look like the following: 

```javascript

(function(){ //use a closure around the mold to give it a private scope
	var mold = uni.mold('meep'); //define the mold
	mold.inherit('foo'); // inherit actions from foo
	mold.act('log',function(pack,done){ // define action 'log'
		console.log(pack);
		done.pass();
	});
	mold.act('annoy',function(pack,done){ // define action 'annoy'
		alert(pack);
		done.pass();
	});
})();

```

For details on defining actions, look at [actions](actions.md).

