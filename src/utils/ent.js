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

