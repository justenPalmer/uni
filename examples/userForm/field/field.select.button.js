'use strict';
(function(){

	var M = 'field.select.button';
	var mold = uni.mold(M);

	mold.inherit('field');
	mold.inherit('field.select');

	/***** ACTIONS *****/

	/*
	init (act):
		pack (obj):
			$el (obj): jquery obj of inputBox or container around input or select
			name (str): name of field
			optionActiveClass (str): class(es) to apply to active option, defaults to 
			optionDefaultClass (str): class applied to all options
			optionNoDeselect (bool): if true, will not allow deselecting
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

		ent.$select = $('<div class="btn-group"></div>');
		ent.$el.append(ent.$select);

		ent.optionDefaultClass = pack.optionDefaultClass || 'btn btn-default';
		ent.optionActiveClass = pack.optionActiveClass || 'btn-primary active';
		ent.optionNoDeselect = pack.optionNoDeselect;

		ent.options = []; // init options array, to not break functions

		/*** binding ***/
		var blur = function(data){
			//console.log('blur:',ent.$el.find(':focus').length);
			uni.ch(function(d,ch){
				if (ent.$el.find(':focus').length < 1){ //check if current focused element is not inside $el
					ent.act('validate',data);
				}
			});
			ent.act('errorDescriptionHide',data);
		};
		var keyup = function(e,data){ 
			data = data || {};
			var $this = $(this);
			if (e.keyCode == 37){ // if left, move to prev focusable
				var $prev = $this.prev();
				if ($prev.length > 0) $prev.focus();
			} else if (e.keyCode == 38){ // if up, move to before focusable
				var $edge = $this.parent().children().first();
				var $inputs = $(':focusable');
				var ind = $inputs.index($edge[0])-1;
				if ($inputs.eq(ind).length > 0 && ind >= 0) $inputs.eq(ind).focus();
			} else if (e.keyCode == 39){ // if right, move to next focusable
				var $next = $this.next();
				if ($next.length > 0) $next.focus();
			} else if (e.keyCode == 40){ // if down, move to after focusable
				var $edge = $this.parent().children().last();
				var $inputs = $(':focusable');
				var ind = $inputs.index($edge[0])+1;
				if ($inputs.eq(ind).length > 0) $inputs.eq(ind).focus();
			}
		};

		ent.$el.on('click','button',function(){
			var $this = $(this);
			var option = optionGetBy$option(ent,{$option:$this});
			if (ent.val == option.val){ //is selected
				ent.act('deselect',{$option:$this});
			} else { //is not selected
				ent.act('select',{$option:$this});
			}
		}).on('keyup','button',function(e){
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
		}).on('focus','button',function(){
			ent.focused = true;
			ent.act('errorDescriptionShow');
		}).on('blur','button',function(){
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
			var html = '<button ind="'+i+'" val="'+option.val+'" ';
			option.defaultClass = option.defaultClass || ent.optionDefaultClass;
			option.activeClass = option.activeClass || ent.optionActiveClass;
			html += 'class="'+option.defaultClass+' ';
			if (option.val == val){
				html += option.activeClass;
			}
			html += '">'+option.label+'</button>';
			ent.options[i].$option = $(html);
			ent.$select.append(ent.options[i].$option);
		}

		return done.pass();
	});

	/*
	select (act):
		pack (obj):
			$option (obj)
	*/
	mold.act('select',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (!pack.$option) return done.fail('no $option defined');

		var selOption = optionGetBy$option(ent,pack);
		pack.$option.addClass(selOption.activeClass);

		if (ent.valPrev !== undefined){
			var prevOption = optionGetByVal(ent,{val:ent.valPrev});
			prevOption.$option.removeClass(prevOption.activeClass);
		}

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
		pack.$option.removeClass(selOption.activeClass);

		ent.val = undefined;
		ent.act('validate',pack);
		ent.act('changed',pack);
		ent.valPrev = ent.val;

		return done.pass();
	});

	/*
	clear (act):
		pack (obj):
	*/
	mold.act('clear',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (ent.bind.clear) return ent.bind.clear.apply(ent,[pack,done]);
		var $active = ent.$el.find('button.active');
		if ($active.length > 0){
			var activeOption = optionGetBy$option(ent,{$option:$active});
			activeOption.$option.removeClass(activeOption.activeClass);
		}
		ent.val = undefined;
		ent.act('validate',pack);
		ent.act('changed',pack);
		return done.pass();
	});

	/*
	enable (act):
		pack (obj):
	*/
	mold.act('enable',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$el.find('button').removeAttr('disabled');

		return done.pass();
	});

	/*
	disable (act):
		pack (obj):
	*/
	mold.act('disable',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.$el.find('button').attr({disabled:'disabled'});

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