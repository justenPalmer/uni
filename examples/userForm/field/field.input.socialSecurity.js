'use strict';
(function(){

	var M = 'field.input.socialSecurity';
	var mold = uni.mold(M);

	mold.inherit('field');
	mold.inherit('field.input');

	/***** ACTIONS *****/

	/*
	init (act):
		pack (obj):
			$el (obj): jquery obj of inputBox or container around input or select
			$input (obj): jquery obj of input field
			name (str): name of input field
			isRequired (bool): if true, this field is required
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
		pack.bind = pack.bind || {};

		pack.bind.validate = pack.bind.validate || function(data,done){
			var val = this.act('get');
			if (pack.isRequired && val.length < 1) done.fail('no phone entered');
			if (!val.match(/^[0-9]{3}\-[0-9]{2}\-[0-9]{4}$/)){
				return done.fail('not a valid US social security number - format must be 123-45-6789');
			}
			done.pass();
		};

		pack.bind.keyup = pack.bind.keyup || function(data,done){
			var e = data.event;
			if (e.keyCode === 8 || e.keyCode == 37 || e.keyCode == 39) return done.pass();

			var startPos = this.$input[0].selectionStart;
			var val = this.act('get');

			if (startPos < val.length) return done.pass(); //if selection start is not at the end, do not modify
			
			val = val.replace(/[^\-0-9]/g,''); //remove all invalid chars (not hyphens, non-numeric)
			val = val.replace(/\-\-/g,'-'); //remove double hyphens

			var hyphens = val.split('-');
			if (val.length >= 3 && hyphens.length < 2){
				//inject - into val
				val = val.substr(0,3)+'-'+val.substr(3);
			}
			if (val.length >= 6 && hyphens.length < 3){
				val = val.substr(0,6)+'-'+val.substr(6);
			}
			if (val.length > 11){
				val = val.substr(0,11);
			}
			this.act('set',{val:val,noValidate:true});
			done.pass({noValidateFail:true});
		};

		return ent.pact('field.input','init',pack,done);
	});


})();