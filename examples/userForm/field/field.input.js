'use strict';
(function(){

	var M = 'field.input';
	var mold = uni.mold(M);

	mold.inherit('field');

	/***** ACTIONS *****/

	/*
	init (act):
		pack (obj):
			$el (obj): jquery obj of inputBox or container around input or select
			$input (obj): jquery obj of input field
			name (str): name of input field
			bind (obj)
				changed (fun): called when input changes
				get (fun): called when get is called
				validate (fun): called for input validation
				error (fun): called on error
				errorClear (fun):
				keyup (fun):
				blur (fun):
	*/
	mold.act('init',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$el = pack.$el;
		if (!ent.$el) return done.fail('no $el defined');
		ent.$input = pack.$input || pack.$el.find('input');
		if (!ent.$input) return done.fail('no $input defined');
		ent.name = pack.name || ent.$input.attr('name');

		/*** binding ***/
		var keyTimeout;
		var keyup = function(e,data){ 
			data = data || {};
			if (e.keyCode == 38){ // if up, move to next input group
				var $edge = $(this);
				var $inputs = $(':focusable');
				var ind = $inputs.index($edge[0])-1;
				if ($inputs.eq(ind).length > 0 && ind >= 0) $inputs.eq(ind).focus();
				return blur();
			}
			if (e.keyCode == 40){ // if down, move to next input group
				var $edge = $(this);
				var $inputs = $(':focusable');
				var ind = $inputs.index($edge[0])+1;
				if ($inputs.eq(ind).length > 0) $inputs.eq(ind).focus();
				return blur();
			}
			if (e.keyCode == 13){
				var inputs = $(':focusable');
				inputs.eq(inputs.index(ent.$input[0])+1).focus();
				ent.act('errorDescriptionHide',data);
				return;
			}
			if (e.keyCode == 9) return;
			if (keyTimeout) clearTimeout(keyTimeout);
			keyTimeout = setTimeout(function(){
				data.showErrorDescription = true;
				ent.act('validate',data);
			},300);
		};
		var blur = function(data){
			ent.act('errorDescriptionHide',data);
			ent.act('valSet',data);
		};

		ent.$el.on('focus','input',function(){
			ent.focused = true;
			ent.act('errorDescriptionShow');
		}).on('blur','input',function(){
			ent.focused = false;
			if (ent.bind.blur) ent.bind.blur.apply(ent,[{},{
				fail:function(err){
					ent.act('error',{err:err});
				},
				pass:function(res){
					blur(res);
				}
			}]);
			else blur();
		}).on('keyup','input',function(e){
			var me = this;
			if (ent.bind.keyup) ent.bind.keyup.apply(ent,[{event:e},{
				fail:function(err){
					ent.act('error',{err:err});
				},
				pass:function(res){
					keyup.apply(me,[e,res]);
				}
			}]);
			else keyup.apply(me,[e]);
		});

		return ent.pact('field','init',pack,done);
	});

	/*
	set (act):
		pack (obj):
			val (str)
	*/
	mold.act('set',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$input.val(pack.val);
		ent.act('valSet',pack);
		return done.pass();
	});

	/*
	get (act): returns value for this field
		pack (obj):
	*/
	mold.act('get',function(pack,done){
		var ent = this;
		pack = pack || {};

		var val = ent.$input.val();
		if (ent.bind.get) return ent.bind.get.apply(ent,[pack,done]);
		return done.pass(val);
	});

	/*
	clear (act):
		pack (obj):
	*/
	mold.act('clear',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$input.val('');
		if (ent.bind.clear) return ent.bind.clear.apply(ent,[pack,done]);
		return done.pass();
	});

	/*
	valSet (act):
		pack (obj):
			noValidate (bool): if true, will not validate input
	*/
	mold.act('valSet',function(pack,done){
		var ent = this;
		pack = pack || {};

		var val = ent.act('get');
		ent.act('validate',pack);
		ent.act('changed',pack);
		ent.valPrev = val;

		return done.pass();
	});

	/*
	validate (act):
		pack (obj):
			noValidate (bool): if true, will not validate input
	*/
	mold.act('validate',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (pack.noValidate) return done.pass();

		var val = ent.act('get',pack);
		uni.ch(function(d,ch){
			if (ent.bind.validate) return ent.bind.validate.apply(ent,[pack,ch]);
			ch.pass();
		}).pass(function(d,ch){
			ent.act('errorClear',pack);
			done.pass();
		}).fail(function(d){
			if (pack.noValidateFail) return done.pass();
			pack.err = d;
			ent.act('error',pack);
			if (pack.showErrorDescription) ent.act('errorDescriptionShow',pack);
			done.pass(d);
		});
	});

	/*
	changed (act):
		pack (obj):
			noChanged (bool): if true, will not trigger change event
	*/
	mold.act('changed',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (pack.noChanged) return done.pass();

		var val = ent.act('get',pack);
		if (val == ent.prevVal) return done.pass();

		if (ent.bind.changed) return ent.bind.changed.apply(ent,[pack,done]);

		return done.pass();
	});

})();

