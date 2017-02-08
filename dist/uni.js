/*
* Uni v0.1
* Copyright (c) 2017-present, Justen Palmer
*/
'use strict';
(function(){
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
					me.loop(o,loop,done,a);
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
})();
(function(){
var me = uni.ent = {};

var entGet = function(world,mold,signature){
	if (uni.type(mold) !== 'str') return uni.fail('ent: mold is not a string');
	var fingerprint = (signature !== undefined && signature !== null)? mold+'~'+signature: mold; // combine mold and signature into fingerprint
	if (world._ent[fingerprint]) return world._ent[fingerprint]; // if ent already exists in world return it

	var ent = { // make new ent
		mold:mold,
		signature:signature,
		fingerprint:fingerprint,
		world:world, // circular ref to world
	};
	world._ent[fingerprint] = ent; // bring ent into world

	/*
	act (fun):
		act (str): action name to do
		pack (any): data for action
		done (obj):
			pass (fun)
			fail (fun)
	*/
	ent.act = function(act,pack,done){ // entity action
		done = uni.done(done);
		if (uni.type(act) !== 'str') return done.fail('ent: act is not a string');
		if (uni._mold[ent.mold] === undefined) return done.fail('ent: mold '+ent.mold+' not defined');
		var m = uni._mold[ent.mold];
		if (m._act && m._act[act]) return m._act[act].apply(ent,[pack,done]); // do action, pass in the ent as this
		//call action on parent molds
		if (m._parents){
			for (var i=0,len=m._parents.length;i<len;i++){
				var par = m._parents[i];
				if (par._act[act]) return par._act[act].apply(ent,[pack,done]);
			}
		}
		return done.fail('ent: mold '+ent.mold+' action '+act+' not defined');
	};

	/*
	pact (fun): parent action
		par (str): parent mold str
		act (str): action name to do
		pack (any): data for action
		done (obj):
			pass (fun)
			fail (fun)
	*/
	ent.pact = function(par,act,pack,done){ // entity action
		done = uni.done(done);
		if (uni.type(par) !== 'str') return done.fail('ent: parent is not a string');
		if (uni.type(act) !== 'str') return done.fail('ent: act is not a string');
		if (uni._mold[par] === undefined) return done.fail('ent: mold '+ent.mold+' not defined');
		var m = uni._mold[par];
		if (m._act && m._act[act]) return m._act[act].apply(ent,[pack,done]); // do action, pass in the ent as this
		return done.fail('ent: mold '+ent.mold+' parent '+par+' action '+act+' not defined');
	};	

	/*
	watch (fun):
		watcher (obj): uni ent
		signal (str): name of the event to watch for
		react (fun): function to call when event is triggered
			d (any): data passed through
	*/
	ent._watchers = {};
	ent.watch = function(watcher,signal,react){
		if (!watcher || !watcher.fingerprint) return uni.fail('ent.watch: no watcher or fingerprint defined');
		ent._watchers[signal] = ent._watchers[signal] || {};
		ent._watchers[signal][watcher.fingerprint] = react;
	};

	return ent;
};

me.fill = function(world){
	world._ent = world._ent || {};
	world.ent = function(mold,signature){
		return entGet(world,mold,signature);
	};
};


})();
(function(){
var me = uni.mold = function(type){
	uni._mold = uni._mold || {};
	var mold = {};
	uni._mold[type] = mold;
	mold._act = {};
	mold.act = function(action,func){
		mold._act[action] = func;
	};

	//TODO: no way to inherit private functions
	mold.inherit = function(t){
		//inherit actions
		if (!uni._mold[t]) return uni.fail('inherit: no mold found for:',t);

		mold._parents = mold._parents || [];
		mold._parents.unshift(uni._mold[t]);
		/*
		for (var i in uni._mold[t]._act){
			mold._act[i] = uni._mold[t]._act[i];
		}
		*/
	};
	mold.signal = function(ent,signal,d){
		//call callbacks bound to this ent
		if (!ent._watchers || !ent._watchers[signal]) return;
		for (var i in ent._watchers[signal]){
			ent._watchers[signal][i](d);
		}
	};
	return mold;
};
})();
(function(){
var me = {};
uni.world = me.world = function(){
	var world = {};
	uni.ent.fill(world);
	return world;
};

})();
