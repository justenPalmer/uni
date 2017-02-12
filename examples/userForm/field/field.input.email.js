'use strict';
(function(){

	var M = 'field.input.email';
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
			if (pack.isRequired && val.length < 1) done.fail('no email entered');
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(val)) return done.fail('not a valid email');
			done.pass();
		};

		return ent.pact('field.input','init',pack,done);
	});


})();