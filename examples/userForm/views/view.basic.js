(function(){
	var mold = 'view.basic';
	var me = uni.mold(mold);
	me.inherit('view');

	me.act('build',function(pack,done){
		var ent = this;
		var world = ent.world;
		pack = pack || {};

		ent.$el = ent.act('$el',{});
		ent.$areas = ent.act('$areas',{});

		$('body').append(ent.$el);

		var sigRoot = ent.fingerprint+'-';
		var fields = {};

		/*** lastName ***/
		fields.lastName = world.ent('field.input',sigRoot+'lastName');
		fields.lastName.act('init',{
			$el:ent.$areas['lastName'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val.length < 1) return done.fail('no last name entered');
					if (val.length > 50) return done.fail('last name is over 50 chars');
					done.pass();
				}
			}
		});

		/*** firstName ***/
		fields.firstName = world.ent('field.input',sigRoot+'firstName');
		fields.firstName.act('init',{
			$el:ent.$areas['firstName'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val.length < 1) return done.fail('no first name entered');
					if (val.length > 50) return done.fail('first name is over 50 chars');
					done.pass();
				}
			}
		});

		/*** middleName ***/
		fields.middleName = world.ent('field.input',sigRoot+'middleName');
		fields.middleName.act('init',{
			$el:ent.$areas['middleName'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val.length < 1) return done.fail('no middle name entered');
					if (val.length > 50) return done.fail('middle name is over 50 chars');
					done.pass();
				}
			}
		});

		/*** suffix ***/
		fields.suffix = world.ent('field.input',sigRoot+'suffix');
		fields.suffix.act('init',{
			$el:ent.$areas['suffix'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val.length > 10) return done.fail('suffix is over 10 chars');
					done.pass();
				}
			}
		});

		/*** dob ***/
		fields.dob = world.ent('field.input.date',sigRoot+'dob');
		fields.dob.act('init',{
			$el:ent.$areas['dob'],
			isRequired:true
		});

		/*** sex ***/
		fields.sex = world.ent('field.select.button',sigRoot+'sex');
		fields.sex.act('init',{
			$el:ent.$areas['sex'],
			optionNoDeselect:true,
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val === undefined) return done.fail('no sex selected');
					done.pass();
				}
			}
		});
		var options = [
			{val:'F',label:'Female'},
			{val:'M',label:'Male'}
		];
		fields.sex.act('populate',{options:options});

		/*** address ***/
		fields.address = world.ent('field.input',sigRoot+'address');
		fields.address.act('init',{
			$el:ent.$areas['address'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val.length < 1) return done.fail('no address entered');
					if (val.length > 50) return done.fail('address is over 50 chars');
					done.pass();
				}
			}
		});

		/*** city ***/
		fields.city = world.ent('field.input',sigRoot+'city');
		fields.city.act('init',{
			$el:ent.$areas['city'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val.length < 1) return done.fail('no city entered');
					if (val.length > 50) return done.fail('city is over 50 chars');
					done.pass();
				}
			}
		});

		/*** state ***/
		fields.state = world.ent('field.select.state',sigRoot+'state');
		fields.state.act('init',{
			$el:ent.$areas['state'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val === undefined || val.length < 1) return done.fail('no state entered');
					if (val.length > 2) return done.fail('state is over 2 chars');
					done.pass();
				}
			}
		});

		/*** zip ***/
		fields.zip = world.ent('field.input',sigRoot+'zip');
		fields.zip.act('init',{
			$el:ent.$areas['zip'],
			bind:{
				validate:function(data,done){
					var val = this.act('get');
					if (val.length < 1) return done.fail('no zip entered');
					if (val.length > 50) return done.fail('zip is over 50 chars');
					done.pass();
				}
			}
		});

		/*** phoneHome ***/
		fields.phoneHome = world.ent('field.input.phone',sigRoot+'phoneHome');
		fields.phoneHome.act('init',{
			$el:ent.$areas['phoneHome']
		});

		/*** phoneWork ***/
		fields.phoneWork = world.ent('field.input.phone',sigRoot+'phoneWork');
		fields.phoneWork.act('init',{
			$el:ent.$areas['phoneWork']
		});

		/*** phoneMobile ***/
		fields.phoneMobile = world.ent('field.input.phone',sigRoot+'phoneMobile');
		fields.phoneMobile.act('init',{
			$el:ent.$areas['phoneMobile']
		});

		/*** socialSecurity ***/
		fields.socialSecurity = world.ent('field.input.socialSecurity',sigRoot+'socialSecurity');
		fields.socialSecurity.act('init',{
			$el:ent.$areas['socialSecurity'],
			isRequired:true
		});

		/*** email ***/
		fields.email = world.ent('field.input.email',sigRoot+'email');
		fields.email.act('init',{
			$el:ent.$areas['email'],
			isRequired:true
		});

		ent.$el.find(':focusable').first().focus();

		return done.pass();
	});


})();

