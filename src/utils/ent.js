var me = uni.ent = {};

var entGet = function(world,mold,signature){
	if (uni.type(mold) !== 'str') return uni.fail('ent: mold is not a string');
	var fingerprint = (signature)? mold+'~'+signature: mold; // combine mold and signature into fingerprint
	if (world._ent[fingerprint]) return world._ent[fingerprint]; // if ent already exists in world return it

	var ent = { // make new ent
		mold:mold,
		signature:signature,
		fingerprint:fingerprint,
		world:world, // circular ref to world
	};
	world._ent[fingerprint] = ent; // bring ent into world

	ent.act = function(act,pack,done){ // entity action
		done = uni.done(done);
		if (uni.type(act) !== 'str') return done.fail('ent: act is not a string');
		if (uni._mold[ent.mold] === undefined) return done.fail('ent: mold '+ent.mold+' not defined');
		var m = uni._mold[ent.mold];
		if (!m.act || !m.act[act]) return done.fail('ent: mold '+ent.mold+' act '+act+' not defined');
		return m.act[act].apply(ent,[pack,done]); // do action, pass in the ent as this
	};

	ent.watch = function(watcher,behav,respon){

	};

	return ent;
};

me.fill = function(world){
	world._ent = world._ent || {};
	world.ent = function(mold,signature){
		return entGet(world,mold,signature);
	};
};

