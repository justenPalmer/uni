var me = {};
window.uni = me; // assign uni namespace

/*
done (fun): defines a done to have pass and fail by default
	---done---
*/
me.done = function(done){
	done = done || {};
	if (!done.pass) done.pass = function(res){return res};
	if (!done.fail) done.fail = function(e){uni.fail(e)};
	return done;
};

/*
fail (fun): 
	val (str):
*/
me.fail = function(){
	console.error.apply(this,arguments);
};

/*
type (fun): retrieves a variable's type as a three letter string
	val (any)
*/
me.type = function(val){
	if (val === undefined) return 'und';
	if (val === null) return 'nul';
	if (val === true || val === false) return 'bool';
	var type = typeof val;
	if (type == 'string') return 'str';
	if (type == 'number') return 'num';
	if (type == 'function') return 'fun';
	if (Object.prototype.toString.call(val) == '[object Array]') return 'ary';
	return 'obj';
};

/*
ch (fun): chain
	a (fun): first function to execute in the ch
	return (obj): chainable with done, loop, and fail
		[done] (fun): done calls the done ch method in the queue
		[loop] (fun): loop calls the current ch method in the queue, again
		[fail] (fun): fail calls the done fail method in the ch

*/
me.ch = uni.ch = function(a){
	var inc = 0;
	var queue = [{ch:a}]; //build queue with json object

	var done = function(res){
		if (this.called) return; //prevents done from being called twice
		while(inc<queue.length-1 && !this.called){
			inc++;
			if (queue[inc].ch){
				if (typeof queue[inc].ch == 'function'){
					//if (res === undefined) res = {};
					queue[inc].ch(res,{done:done,loop:loop,fail:failCb});
				}
				this.called = true;
			}
		}
	};

	var loop = function(res){
		if (this.called) return; //prevents loop from being called twice
		while(inc<queue.length && !this.called){
			if (queue[inc].ch){
				if (typeof queue[inc].ch == 'function'){
					queue[inc].ch(res,{done:done,loop:loop,fail:failCb});
				}
				this.called = true;
			}
			else {
				inc++;
			}
		}
	};

	var failCb = function(res){
		if (this.called) return; //prevents done from being called twice
		while(inc<queue.length-1 && !this.called){
			inc++;
			if (queue[inc].fail){
				if (typeof queue[inc].fail == 'function'){
					queue[inc].fail(res,{done:done,loop:loop,fail:failCb});
				}
				this.called = true;
			}
		}
	};
	setTimeout(function(){
		a({},{
			done:done,
			loop:loop,
			fail:failCb
		});
	},1);
	var ch = function(b){
		queue.push({ch:b});
		return this;
	};
	var fail = function(b){
		queue.push({fail:b});
		return this;
	};
	var cbCb = function(b){
		for (var i in b){
			if (typeof b[i] == 'function' && i=='done' || i=='fail'){
				var bObj = {};
				if (i=='done') bObj.ch = b.done; //oops
				else bObj[i] = b[i];
				queue.push(bObj);
			}
		}
		return this;
	};
	return {
		ch:ch,
		fail:fail,
		cb:cbCb
	}
};