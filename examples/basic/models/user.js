(function(){
	var mold = 'model.user';
	var me = uni.mold(mold);
	me.inherit('model');
	
	me.act.get = function(pack,done){
		var rec = {name:'bob'};
		//me.trigger(this,'get',rec);
		return done.pass(rec);
	};
})();