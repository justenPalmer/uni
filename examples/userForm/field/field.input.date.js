'use strict';
(function(){

	var M = 'field.input.date';
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
			if (pack.isRequired && val.length < 1) done.fail('no date entered');
			if (!val.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/)){
				return done.fail('not a valid date - format must be YYYY-MM-DD');
			}
			//make Date object to validate
			var dateAry = val.split('-');
			for (var i=0;i<3;i++){
				dateAry[i] = Number(dateAry[i]);
			}
		    var D = new Date(dateAry[0], (dateAry[1] - 1), dateAry[2]);
		    console.log(D.getFullYear(),dateAry[0],D.getMonth(),(dateAry[1] - 1),D.getDate(),dateAry[2]);
		    if (D.getFullYear() != dateAry[0] || D.getMonth() != (dateAry[1] - 1) || D.getDate() != dateAry[2]){
		        return done.fail('not a valid date');
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
			if (val.length >= 4 && hyphens.length < 2){
				//inject - into val
				val = val.substr(0,4)+'-'+val.substr(4);
			}
			if (val.length >= 7 && hyphens.length < 3){
				val = val.substr(0,7)+'-'+val.substr(7);
			}
			if (val.length > 10){
				val = val.substr(0,10);
			}
			this.act('set',{val:val,noValidate:true});
			done.pass({noValidateFail:true});
		};

		pack.bind.blur = pack.bind.blur || function(data,done){
			var val = this.act('get');
			var hyphens = val.split('-');
			if (hyphens[1] && hyphens[1].length == 1) hyphens[1] = '0'+hyphens[1];
			if (hyphens[2] && hyphens[2].length == 1) hyphens[2] = '0'+hyphens[2];
			val = hyphens.join('-');
			this.act('set',{val:val,noValidate:true});
			done.pass();
		};

		return ent.pact('field.input','init',pack,done);
	});


})();