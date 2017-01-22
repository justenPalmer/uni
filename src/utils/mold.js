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
	mold.trigger = function(ent,event,pack){
		//call callbacks bound to this ent
	};
	return mold;
};