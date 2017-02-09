# uni tools

## CHAIN

Chains are Uni's way of handling asynchronous functions. They are much more composable and simple to understand than promises.

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

## LOOP

Loops are used to handle asynchronous repeating functions. Loops are used when a standard loop operator like "for" will not work.

```javascript

var ary = [1,2,3];
uni.loop(ary,function(loop){
	console.log('loop ',ary[loop.i]);
	loop.pass();
});

```