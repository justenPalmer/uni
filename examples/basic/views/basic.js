(function(){
	var mold = 'view.basic';
	var me = uni.mold(mold);
	me.inherit('view');

	me.act.build = function(pack,done){
		var ent = this;
		var render = {message:'hello world 222'};

		var sess = ent.world.ent('model.user').act('get');
		render.name = sess.name;

		ent.el = ent.act('render',{render:render});
		document.querySelector('body').appendChild(ent.el);
		return done.pass();
	};


})();

