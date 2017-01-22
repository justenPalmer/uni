
var world = uni.world();

world.ent('view').act('init');
var viewBasic = world.ent('view.basic');
viewBasic.act('build');

/*
c.a('get', sess)

var foo = c.store('users',{foo:'bar'});

c.view('basic').a('build',{sess:sess});

console.log('c:',c);
*/