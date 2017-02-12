(function(){
	var M = 'view';
	var mold = uni.mold(M);

	/*
	init (act): initializes all views by detaching the dom elements and storing them as html strings
		pack (obj):
	*/
	mold.act('init',function(pack,done){
		mold._el = {};
		//TODO: import views

		// detach views from dom and store them
		var els = document.querySelectorAll('[view]');
		for (var i=0,len=els.length;i<len;i++){
			var el = els[i];
			var view = el.getAttribute('view');
			if (el.parentNode) mold._el['view.'+view] = el.parentNode.removeChild(el);
		}
		return done.pass();
	});

	/*
	render (act): renders a tpl html string and returns it as a dom element
		pack (obj):
			tpl (str): html string to be rendered - if not defined, will be the view's html template
			render (obj): object whcih defines values to be rendered into the tpl
	*/
	mold.act('render',function(pack,done){
		var ent = this;
		pack = pack || {};

		pack.tpl = pack.tpl;
		if (!pack.tpl && pack.view) pack.tpl = mold._el[pack.view].outerHTML;
		if (!pack.tpl && mold._el[ent.mold]) pack.tpl = mold._el[ent.mold].outerHTML;
		if (!pack.tpl) return done.fail('render: no tpl');
		var tags = pack.tpl.split('~~');
		//jn.log('render:',a.render);
		pack.render = pack.render || {};
		if (tags.length == 1){
			var el = htmlToEl(pack.tpl);
			return el;
		}
		for (var i=0,len=tags.length;i<len;i++){
			var str = tags[i];
			if (str.indexOf('raw ') === 0){
				var prop = str.substr(4);
				//sterilize output
				if (pack.render[prop] !== undefined) tags[i] = pack.render[prop];
				else tags[i] = '~~raw '+prop+'~~';
			} 
			if (str.indexOf('set ') === 0){
				var prop = str.substr(4);
				//jn.log('prop:',prop,pack.render[prop]);
				if (pack.render[prop] !== undefined) tags[i] = stripTags(pack.render[prop]);
				else tags[i] = '~~set '+prop+'~~';
			}
		}
		var el = htmlToEl(tags.join(''));
		return done.pass(el);
	});

	/*
	$el (act): retrieves an instance of the view as a jquery object
		pack (obj):
			render (obj): if defined, will render values in this obj into the view
	*/
	mold.act('$el',function(pack,done){
		var ent = this;
		pack = pack || {};
		var el = ent.act('render',pack);
		var $el = $(el);
		return done.pass($el);
	});

	/*
	$areas (act): retrieves all elements with [area=""] attributes inside of $el
		pack (obj):
			$el (obj): jquery element to look inside of for areas
	*/
	mold.act('$areas',function(pack,done){
		var ent = this;
		pack = pack || {};
		var $areas = {};
		pack.$el = pack.$el || ent.$el;
		pack.$el.find('[area]').each(function(){
			var $this = $(this);
			$areas[$this.attr('area')] = $this;
		});
		return done.pass($areas);
	});

	var htmlToEl = function(html){
		var wrapper = document.createElement('div');
		wrapper.innerHTML = html;
		return wrapper.firstChild;
	};

	/*
	stripTags (fun): strips out all html tags
		text (str)
	*/
	var stripTags = function(text){
		if (text === undefined) return '';
		return String(text).replace(/<(?:.|\n)*?>/gm, '');
	};
	

})();