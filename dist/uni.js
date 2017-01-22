/*
* Uni v0.1
* Copyright (c) 2017-present, Justen Palmer
*/
'use strict';
(function(){
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
})();
(function(){
var me = {};
uni.tools = me;

/*
morph (fun): morph manipulates objects in a number of different ways
	o (obj, str, or ary)
	---a---
	[thaw] (str): creates the target obj from a string
	[unweb] (str): convert query format to obj
	[clone] (bool): if true, creates a shallow copy of the obj
	[merge] (obj): merges this object into the target, target properties are overwritten
	[shrink] (str or ary): removes attributes specified by shrink
	[separate] (ary): removes all attributes NOT in the ary
	[sort] (bool): puts object keys in order
	[web] (bool): turns the object into a query string
	[freeze] (bool): turns object into a string
*/
me.morph = uni.morph = function(o){
	var type = uni.type(o);
	if (type == 'obj'){
		for (var i=1,len=arguments.length;i<len;i++){
			var rules = arguments[i];
			if (rules.clone){
				var t = {};
				for (var attr in o) {t[attr] = o[attr];}
				o = t;
			}
			if (rules.merge) for (var attr in rules.merge){o[attr] = rules.merge[attr];}
			if (rules.freeze){
				try {
					var str = JSON.stringify(o);
				} catch(e){
					return ''
				}
				return str;
			}
			if (rules.shrink){
				if (rules.shrink instanceof Array) {
					for (var i=0,len=rules.shrink.length;i<len;i++){
						if (o[rules.shrink[i]]) delete o[rules.shrink[i]];
					}
				}
				else if (typeof rules.shrink == 'string'){
					if (o[rules.shrink]) delete o[rules.shrink];
				}
			}
			if (rules.separate){
				for (var i in o){
					if (rules.separate.indexOf(i) === -1) {
						delete o[i];
					}
				}
			}
			if (rules.sort){
				var sort = [];
				for (var i in o){
					sort.push(i);
				}
				sort.sort();
				var sorted = {};
				for (var i=0,len=sort.length;i<len;i++){
					sorted[sort[i]] = o[sort[i]];
				}
				o = sorted;
			}
			if (rules.web){
				var str='',first=true;
				for (var i in o){
					if (!first) str += '&';
					if (typeof o[i] == 'object'){
						str += i+'='+encodeURIComponent(JSON.stringify(o[i]));
					}
					else str += i+'='+encodeURIComponent(o[i]);
					first = false;
				}
				//if (str != '') str = '?'+str;
				return str;
			}
			
		}
		return o;
	}
	if (type == 'str'){
		for (var i=1,len=arguments.length;i<len;i++){
			var rules = arguments[i];
			if (rules.unweb){
				o = o.replace(/\?/, '');
				var ary = o.split('&');
				o = {};
				for (var i=0,len=ary.length;i<len;i++){
					var v = ary[i].split('=');
					try {
						o[v[0]] = JSON.parse(decodeURIComponent(v[1]));
					}
					catch(e){
						o[v[0]] = decodeURIComponent(v[1]);
					}
				}
				return o;
			}
			if (rules.thaw) {
				try {	
					o = JSON.parse(o);
				} catch(e){
					uni.fail('morph thaw fail:',e);
				}
				return o;
			}
			if (rules.freeze) {
				return o;
			}
		}
	}
	if (type == 'ary'){
		for (var i=1,len=arguments.length;i<len;i++){
			var rules = arguments[i];
			if (rules.freeze){
				try {
					var str = JSON.stringify(o);
				} catch(e){
					uni.fail('morph freeze fail:',e);
					return o;
				}
				return str;
			}
		}
	}
	return o;
};

/*
done (fun): defines a done to have pass and fail by default
	---done---
*/
me.done = uni.done = function(done){
	done = done || {};
	if (!done.pass) done.pass = function(){};
	if (!done.fail) done.fail = function(e){uni.fail(e)};
	return done;
};

/*
fail (fun): 
	val (str):
*/
me.fail = uni.fail = function(){
	console.error.apply(this,arguments);
};

/*
type (fun): retrieves a variable's type as a three letter string
	val (any)
*/
me.type = uni.type = function(val){
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
me.loop = uni.loop = function(o,loop,done,a){
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

})();
(function(){
var me = uni.ent = {};

var entGet = function(world,mold,signature){
	if (uni.type(mold) !== 'str') return uni.fail('ent: mold is not a string');
	var identity = (signature)? mold+'~'+signature: mold; // combine mold and signature into identity
	if (world._ent[identity]) return world._ent[identity]; // if ent already exists in world return it

	var ent = { // make new ent
		mold:mold,
		signature:signature,
		world:world, // circular ref to world
	};
	world._ent[identity] = ent; // bring ent into world

	ent.act = function(act,pack,done){ // entity action
		done = uni.done(done);
		if (uni.type(act) !== 'str') return done.fail('ent: act is not a string');
		if (uni._mold[ent.mold] === undefined) return done.fail('ent: mold '+ent.mold+' not defined');
		var m = uni._mold[ent.mold];
		if (!m.act || !m.act[act]) return done.fail('ent: mold '+ent.mold+' act '+act+' not defined');
		return m.act[act].apply(ent,[pack,done]); // do action, pass in the ent as this
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
	mold.act = {};
	mold.inherit = function(t){
		//inherit actions
		if (!uni._mold[t]) return uni.fail('inherit: no mold found for:',t);
		for (var i in uni._mold[t].act){
			mold.act[i] = uni._mold[t].act[i];
		}
	};
	return mold;
};
})();
(function(){
var me = {};
uni.world = function(){
	var world = {};
	uni.ent.fill(world);
	return world;
};

})();
