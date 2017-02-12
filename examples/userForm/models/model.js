(function(){
	var M = 'model';
	var mold = uni.mold(M);

	mold.act('validate',function(pack,done){
		return done.pass();
	});

	mold.act('api',function(pack,done){
		uni.ch(function(d,ch){

		});
	});


})();