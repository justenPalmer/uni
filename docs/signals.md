# uni signals

Signals are Uni events that are broadcast by entities. They ay be watched by other entities which may respond to the signal.

## Broadcast signal

Signals are broadcast by the mold that defines an entity.

``` javascript

var world = uni.world();
var meep = world.ent('meep');
meep.act('say','hello');

```

## Watch for signal



