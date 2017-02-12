'use strict';
(function(){

	var M = 'field.select';
	var mold = uni.mold(M);

	mold.inherit('field');

	/***** ACTIONS *****/

	/*
	init (act):
		pack (obj):
			$el (obj): jquery obj of inputBox or container around input or select
			name (str): name of field
			bind (obj)
				changed (fun): called when input changes
				get (fun): called when get is called
				validate (fun): called for input validation
				error (fun): called on error
				errorClear (fun)
				keyup (fun)
	*/
	mold.act('init',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$el = pack.$el;
		if (!ent.$el) return done.fail('no $el defined');

		ent.$select = $('<select name="'+pack.name+'" class="form-control"></div>');
		ent.$el.append(ent.$select);

		ent.options = []; // init options array, to not break functions

		/*** binding ***/
		var blur = function(data){
			ent.act('errorDescriptionHide',data);
			ent.act('validate',data);
		};
		var keyup = function(e,data){ 
			data = data || {};
			var $this = $(this);
			if (e.keyCode == 37){ // if left, move to before focusable
				var $edge = $this;
				var $inputs = $(':focusable');
				var ind = $inputs.index($edge[0])-1;
				if ($inputs.eq(ind).length > 0 && ind >= 0) $inputs.eq(ind).focus();
			} else if (e.keyCode == 39 || e.keyCode == 13){ // if right or enter, move to after focusable
				var $edge = $this;
				var $inputs = $(':focusable');
				var ind = $inputs.index($edge[0])+1;
				if ($inputs.eq(ind).length > 0) $inputs.eq(ind).focus();
			}
		};

		ent.$el.on('change','select',function(){
			var $this = $(this);
			var $option = $this.find('option:selected');
			ent.act('select',{$option:$option,optionNoSelect:true});
		}).on('keyup','select',function(e){
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
		}).on('focus','select',function(){
			ent.focused = true;
			ent.act('errorDescriptionShow');
		}).on('blur','select',function(){
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
		});
		
		return ent.pact('field','init',pack,done);
	});

	/*
	populate (act): build options into select
		pack (obj):
			options (ary):
				option (obj)
					val (str or num)
					label (str)
					activeClass (str)
					defaultClass (str)
	*/
	mold.act('populate',function(pack,done){
		var ent = this;
		pack = pack || {};

		var val = ent.act('get');

		ent.options = pack.options;
		for (var i=0,len=ent.options.length;i<len;i++){
			var option = ent.options[i];
			var html = '<option ind="'+i+'" val="'+option.val+'" ';
			if (option.val == val){
				html += 'selected="selected"';
			}
			html += '>'+option.label+'</option>';
			ent.options[i].$option = $(html);
			ent.$select.append(ent.options[i].$option);
		}

		return done.pass();
	});

	/*
	set (act):
		pack (obj):
			val (str)
	*/
	mold.act('set',function(pack,done){
		var ent = this;
		pack = pack || {};

		var option = optionGetByVal(ent,{val:ent.val});
		pack.$option = option.$option;
		return ent.act('select',pack,done);
	});

	/*
	select (act):
		pack (obj):
			$option (obj)
			optionNoSelect (bool): if true, will not put a selected attr on the $option
	*/
	mold.act('select',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (!pack.$option) return done.fail('no $option defined');
		if (!pack.optionNoSelect) pack.$option.attr({selected:'selected'}).siblings(':selected').removeAttr('selected');

		var selOption = optionGetBy$option(ent,pack);

		ent.val = selOption.val;
		ent.act('validate',pack);
		ent.act('changed',pack);
		ent.valPrev = selOption.val;
		
		return done.pass();
	});

	/*
	deselect (act):
		pack (obj):
			$option (obj)
	*/
	mold.act('deselect',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (ent.optionNoDeselect) return done.pass();

		var selOption = optionGetBy$option(ent,pack);
		pack.$option.removeAttr('selected');

		ent.val = undefined;
		ent.act('validate',pack);
		ent.act('changed',pack);
		ent.valPrev = ent.val;

		return done.pass();
	});

	/*
	get (act): returns value for this field
		pack (obj):
	*/
	mold.act('get',function(pack,done){
		var ent = this;
		pack = pack || {};

		var val = ent.val;
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

		if (ent.bind.clear) return ent.bind.clear.apply(ent,[pack,done]);
		ent.$el.find(':selected').removeAttr('selected');
		ent.val = undefined;
		ent.act('validate',pack);
		ent.act('changed',pack);
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

	/*
	enable (act):
		pack (obj):
	*/
	mold.act('enable',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$select.removeAttr('disabled');

		return done.pass();
	});

	/*
	disable (act):
		pack (obj):
	*/
	mold.act('disable',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$select.attr({disabled:'disabled'});

		return done.pass();
	});

	/***** PRIVATE *****/
	
	/*
	optionGetByVal (fun): gets an option by a value
		ent (obj)
		pack (obj)
			val (str or num)
		--- return ---
		option (obj)
	*/
	var optionGetByVal = function(ent,pack){
		for (var i=0,len=ent.options.length;i<len;i++){
			if (ent.options[i].val == pack.val) return ent.options[i];
		}
	};

	/*
	optionGetBy$option (fun): gets an option by a value
		ent (obj)
		pack (obj)
			$option (obj)
		--- return ---
		option (obj)
	*/
	var optionGetBy$option = function(ent,pack){
		var ind = Number(pack.$option.attr('ind'));
		return ent.options[ind];
	};


})();