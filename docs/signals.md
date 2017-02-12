# uni signals

Signals are Uni's way of broadcasting and catching events. Entities watch for signals from other entities. Signals may be broadcast by entities when they perform actions.

## WATCH

To watch for a signal broadcast by another entity, use the following code:

``` javascript

var meep = this.world.ent('meep');
ent.watch(this, 'jump', function(data, done){
	/*
	code for responding to a jump
	*/
	done.pass();
});

```

### Arguments

- `watcher` (ent): the entity that is watching, usually `this`
- `signal` (str): the name of the signal to be watched
- `function` (fun): the code to be executed when the signal is sent
  - `data` (any): values passed with the signal
  - `done` (obj): callback (done and fail)

## SIGNAL

Signals are send from inside an action, using the mold. Send a signal to watching entities:

``` javascript

var mold = uni.mold('meep');
mold.act('jump',function(pack,done){
	/*
	code for jumping
	*/
	mold.signal(this, 'jump', pack);
});

```

### Arguments

- `signaller` (ent): the entity that is signalling, usually `this`
- `name` (str): name of signal to broadcast
- `data` (any): payload to send to watchers
