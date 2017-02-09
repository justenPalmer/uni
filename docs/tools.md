# uni tools

## CHAIN

Chains are Uni's way of handling asynchronous functions. Each block in a chain represents a functional piece that must be passed to continue on to the next block. If a fail is triggered, the next fail block in the chain will get called.

```javascript

uni.ch(function(d,ch){
	console.log('first');
	ch.pass('first is done');
}).ch(function(d,ch){
	console.log(d,' now on second');
	ch.fail('testing a fail');
}).fail(function(d,ch){
	console.log('failed:',d);
});

```

### Arguments

- `d` (any): data that is passed into the block by the caller
- `ch` (obj): ch is an object that defines a `pass` and `fail` function

For actions, pass the ch object into by action in the place of the done object. Upon pass of the action, the next `ch` block will be executed with `d` holding the value passed inside the `done.pass` call. If fail is called, the next `fail` block will be executed with the value passed in the `done.fail` function as `d`.

## LOOP

Loops are used to handle asynchronous repeating functions. Loops are used when a standard loop operator like "for" will not work.

```javascript

var ary = [1,2,3];
uni.loop(ary,function(loop){
	console.log('loop ',ary[loop.i]);
	loop.pass();
});

```