(function(){
	var mold = 'view';
	var me = uni.mold(mold);

	me.act.init = function(pack,done){
		me._el = {};
		// detach views from dom and store them
		var els = document.querySelectorAll('[view]');
		for (var i=0,len=els.length;i<len;i++){
			var el = els[i];
			var view = el.getAttribute('view');
			if (el.parentNode) me._el['view.'+view] = el.parentNode.removeChild(el);
		}
	};

	me.act.render = function(pack,done){
		pack = pack || {};
		pack.tpl = pack.tpl;
		if (!pack.tpl && pack.view) pack.tpl = me._el[pack.view].outerHTML;
		if (!pack.tpl && me._el[this.mold]) pack.tpl = me._el[this.mold].outerHTML;
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
		return el;
	};

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