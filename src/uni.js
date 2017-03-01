var uni = {};
window.uni = uni; // assign uni namespace

/*
done (fun): defines a done to have pass and fail by default
	---done---
*/
uni.done = function(done){
	done = done || {};
	if (!done.pass) done.pass = function(res){return res};
	if (!done.fail) done.fail = function(e){uni.fail(e)};
	return done;
};

/*
fail (fun): 
	val (str):
*/
uni.fail = function(){
	console.warn.apply(this,arguments);
};

/*
type (fun): retrieves a variable's type as a shortened string
	val (any)
*/
uni.type = function(val){
	if (val === undefined) return 'und';
	if (val === null) return 'null';
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
	return (obj): chainable with pass, loop, and fail
		[pass] (fun): pass calls the pass ch method in the queue
		[fail] (fun): fail calls the pass fail method in the ch
*/
uni.ch = function(first){
	var inc = 0;
	var queue = [{pass:first}]; //build queue with json object
	var chPass = function(res){
		if (this.called) return; //prevents pass from being called twice
		while(inc<queue.length-1 && !this.called){
			inc++;
			if (queue[inc].pass){
				if (typeof queue[inc].pass == 'function'){
					//if (res === undefined) res = {};
					queue[inc].pass(res,{pass:chPass,fail:chFail});
				}
				this.called = true;
			}
		}
	};
	var chFail = function(res){
		if (this.called) return; //prevents pass from being called twice
		while(inc<queue.length-1 && !this.called){
			inc++;
			if (queue[inc].fail){
				if (typeof queue[inc].fail == 'function'){
					queue[inc].fail(res,{pass:chPass,fail:chFail});
				}
				this.called = true;
			}
		}
	};
	var ch = function(){
		first({},{
			pass:chPass,
			fail:chFail
		});
	};
	setTimeout(ch,1);
	var pass = function(b){
		queue.push({pass:b});
		return this;
	};
	var fail = function(b){
		queue.push({fail:b});
		return this;
	};
	var done = function(b){
		for (var i in b){
			if (typeof b[i] == 'function' && i == 'pass' || i == 'fail'){
				var next = {};
				if (i == 'pass') next.pass = b.pass;
				else next[i] = b[i];
				queue.push(next);
			}
		}
		return this;
	};
	return {
		pass:pass,
		fail:fail,
		done:done
	}
};

//TODO: make loop work with done & pass

/*
loop (fun): asynchronous loop method that iterates many different formats
	o (ary or obj): loop will iterate through each element in ary
	loop (fun)
		---obj---
		i (num): current iteration i
		[prop] (str): only defined if an obj is passed into loop
		loop (fun): call this to start the next iteration of loop
	done (fun)
	a (obj): status object
*/
uni.loop = function(o,loop,done,a){
	a = a || {};
	var type = uni.type(o);
	var cond = false, prop;
	if (a.i === undefined) a.i=0;
	var check = function(){
		if (cond && loop){
			var nextI = a.i+1;
			loop({
				i:a.i,
				prop:prop,
				next:function(){
					a.i = nextI;
					uni.loop(o,loop,done,a);
				}
			});
			return;
		}
		if (done) done();
	}
	if (type == 'ary') { //is an array
		if (!a.len) a.len=o.length;
		cond = a.i < a.len;
		check();
	}
	else if (type == 'obj'){
		var i=0;
		for (var p in o) {
			if (i==a.i){
				prop = p;
				break;
			}
			i++;
		}
		cond = (prop)? true: false;
		check();
	}
	else {
		if (done) done();
	}
};