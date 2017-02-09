# uni worlds

Worlds are the container for entities (entities). They are the context in which all Uni data gets attached. Define a world to start building an application in Uni.

## MAKE

To make a world run the following command:

```javascript

var world = uni.world();

```

In the line above the new world is defined by `uni.world();`; that new world is then stored inside the variable `world`.

## USE

Once a world is defined, [molds](molds.md) may be defined, [entities](entities.md) may be initialized, and [actions](actions.md) can be called to craft functionality in the application.
