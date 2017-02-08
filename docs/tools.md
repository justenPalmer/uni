# uni tools

## CHAIN

Chains are Uni's way of handling asynchronous functions. They are much more composable and simple to understand than promises.

'''
var ary = [1,2,3];
uni.loop(ary,function(loop){
	console.log('loop ',ary[loop.i]);
	loop.pass();
});
'''

## LOOP

Loops are used to handle asynchronous repeating functions. Loops are used when a standard loop operator like "for" will not work.

'''
var ary = [1,2,3];
uni.loop(ary,function(loop){
	console.log('loop ',ary[loop.i]);
	loop.pass();
});
'''