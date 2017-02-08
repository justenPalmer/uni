(function(){
	var mold = 'view.basic';
	var me = uni.mold(mold);
	me.inherit('view');

	me.act('build',function(pack,done){
		var ent = this;
		var render = {message:'hello world 222'};

		var sess = ent.world.ent('model.user');
		sess.watch(ent,'get',function(rec){
			//console.log('get triggered:',ent);
		});
		var rec = sess.act('get');
		//console.log('sess:',sess);
		render.name = rec.name;

		//ent.pact('view','render',{render:render});

		ent.el = ent.act('render',{render:render});
		document.querySelector('body').appendChild(ent.el);

		uni.ch(function(d,ch){
			ch.pass('whadd');
		}).pass(function(d,ch){
			console.log(d);
			ch.fail('blah');
		}).fail(function(d,ch){
			uni.fail(d);
		});

		return done.pass();
	});


})();

