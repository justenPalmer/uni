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
			var done = uni.done();
			ent._watchers[signal][i](d,done);
		}
	};
	return mold;
};