'use strict';
(function(){

	var M = 'field';
	var mold = uni.mold(M);

	/***** ACTIONS *****/

	/*
	init (act):
		pack (obj):
			$el (obj): jquery obj of inputBox or container around input or select
			name (str): name of input field
			bind (obj)
				error (fun): called on error
				errorClear (fun)
	*/
	mold.act('init',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (!pack.$el && !ent.$el) return done.fail('no $el defined');
		ent.name = ent.name || pack.name;
		ent.bind = pack.bind || {};

		/*** binding ***/
		ent.$el.on('mouseenter','i',function(){
			ent.act('errorDescriptionShow',{});
		}).on('mouseleave','i',function(){
			ent.act('errorDescriptionHide',{});
		});

		return done.pass();
	});

	/*
	error (act):
		pack (obj):
			err (str)
	*/
	mold.act('error',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (ent.bind.error) return ent.bind.error.apply(ent,[pack,done]);
		ent.$el.addClass('error');
		ent.$el.find('i.fa-exclamation-triangle,.errorDescription').remove();
		ent.$el.append('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>');
		ent.$errorDescription = $('<div class="errorDescription">'+pack.err+'</div>');
		ent.$el.append(ent.$errorDescription);
		if (pack.showErrorDescription) ent.act('errorDescriptionShow',pack);
		else ent.act('errorDescriptionHide',pack);
		ent.err = pack.err;

		return done.pass();
	});

	/*
	errorClear (act): clears out the error on the field
		pack (obj)
	*/
	mold.act('errorClear',function(pack,done){
		var ent = this;
		pack = pack || {};

		if (ent.bind.errorClear) return ent.bind.errorClear.apply(ent,[pack,done]);
		ent.$el.removeClass('error');
		ent.$el.find('i.fa-exclamation-triangle').remove();
		ent.$el.find('.errorDescription').remove();
		delete ent.$errorDescription;
		ent.act('errorDescriptionHide',pack);
		ent.err = '';

		return done.pass();
	});

	/*
	errorDescriptionShow (act): shows the error description
		pack (obj)
	*/
	mold.act('errorDescriptionShow',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.errorDescriptionShown = true;
		if (ent.$errorDescription) ent.$errorDescription.show();

		return done.pass();
	});

	/*
	errorDescriptionHide (act): hides the error description
		pack (obj)
	*/
	mold.act('errorDescriptionHide',function(pack,done){
		var ent = this;
		pack = pack || {};

		ent.errorDescriptionShown = false;
		if (ent.$errorDescription) ent.$errorDescription.hide();

		return done.pass();
	});

})();

