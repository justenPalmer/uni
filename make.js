var fs = require('fs');
var dirRoot = __dirname+'/'; //the root directory

/*
build (fun): builds uni distribution
*/
var build = function(a){

	var fail = function(err){
		console.error('make build failed:',err);
	};

	var output = [
		'/*',
		'* Uni v0.1',
		'* Copyright (c) 2017-present, Justen Palmer',
		'*/',
		"'use strict';"
	].join('\n')+'\n';
	util.ch(function(d,ch){
		var file = dirRoot+'src/uni.js';
		util.getFile({file:file},ch);
	}).ch(function(d,ch){
		output += '(function(){\n';
		output += d.output+'\n';
		output += '})();\n';
		var crawl = {
			dir:dirRoot+'src/utils/',
			order:['tools.js'],
			file:function(f,done){
				util.getFile({file:f},{
					fail:ch.fail,
					done:function(res){
						output += '(function(){\n';
						output += res.output+'\n';
						output += '})();\n';
						return done();
					}
				});
			}
		};
		util.crawlDir(crawl,ch);
	}).ch(function(d,ch){
		//output += 'uni.init();\n';

		var file = dirRoot+'dist/uni.js';
		fs.writeFile(file,output,'utf-8',function(err){
			if (err) return ch.fail(err);
			console.log('make complete');
			ch.done();
		});
	}).fail(function(d,ch){
		fail(d);
	});
};

// ***** UTILITIES *****

var util = {};

/*
getFile (fun): reads output from file and removes // ~ tags as appropriate
	---a---
	file (str): path to the file to read
*/
util.getFile = function(a,cb){
	if (!a.file) return cb.fail('no file defined');
	fs.readFile(a.file,'utf-8',function(err,output){
		if (err) return cb.fail('file read error:'+err);
		cb.done({output:output});
	});
};

/*
crawlDir (fun): crawls a directory and fires the file callback for each file found
	---a---
	dir (str): directory to crawl with trailing '/'
	file (fun): callback triggered on 
		file (str)
		done (fun)
	[order] (ary): ary of files and folders in order to include
	[exclude] (ary): ary of files and folders to exclude
*/
util.crawlDir = function(a,cb){
	if (!a.dir) return cb.fail('no directory defined');
	if (!a.file) return cb.fail('no file callback defined');

	fs.readdir(a.dir,function(err,files){
		if (!files || err) return cb.done();
		files.sort();
		if (a.order) {
			var nAry = [];
			for(var i=0,len=a.order.length;i<len;i++) {
				var ind = files.indexOf(a.order[i]);
				if (ind != -1) nAry.push(files.splice(ind,1)[0]);
			}
			files = nAry.concat(files);
		}
		util.loop(files,function(loop){
			var file = a.dir+files[loop.i];
			if (a.exclude && (a.exclude.indexOf(files[loop.i]) !== -1 || a.exclude.indexOf(file) !== -1)) return loop.next(); //if file is in exclude ary

			fs.stat(file, function(err,stat){
				if (!stat) return loop.next();
				if (!stat.isDirectory()){
					a.file(file,loop.next);
					return;
				}
				util.crawlDir({dir:file+'/',order:a.order,exclude:a.exclude,file:a.file},{
					fail:cb.fail,
					done:loop.next
				});
			});	
		},function(){
			cb.done();
		});
	});
};

/*
type (fun): retrieves a variable's type
	val (any)
*/
util.type = function(val){
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
util.loop = function(o,loop,done,a){
	a = a || {};
	var type = util.type(o);
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
					util.loop(o,loop,done,a);
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
util.ch = function(a){
	var inc = 0;
	var queue = [{ch:a}]; //build queue with json object

	var done = function(res){
		if (this.called) return; //prevents done from being called twice
		while(inc<queue.length-1 && !this.called){
			inc++;
			if (queue[inc].ch){
				if (typeof queue[inc].ch == 'function'){
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
					//if (res === undefined) res = {};
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

build();