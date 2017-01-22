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
