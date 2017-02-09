# uni entities (ents)

Entities (or ents) are instances of molds with properties and methods. Think about them as individuals with characteristics and behaviors. Each entity has a mold and signature which together comprise the individual's unique fingerprint. Only one ent may exist with a given fingerprint in each world.

## GET

To get an entity, there must be a [mold](docs/molds.md) defined as well as a [world](docs/worlds.md) initialized. Get entities with the following code:

``` javascript

var e1 = world.ent('meep'); // gets the ent with mold 'meep' and store it into the var meep
var e2 = world.ent('meep',1); // gets the ent with signature 1 and fingerprint 'meep~1'

```

The first entity `e1` is defined as being from the mold `meep`. It has no signature. The second entity `e2` is also from the mold `meep`, but has a signature of `1` thus making it a different entity from `e1`.

### Parameters
- `mold` (str): The mold defines the type of entity to create. When instantiated, the entity is associated with the mold of the same name. Then actions performed by that entity will be defined by the named mold.
- `signature` (num or str): Identifier for this ent, only one ent may exist for each mold/signature combination. Use the signature to create multiple unique entities from a single mold.

### Return
 - `ent` (obj): The ent object contains all properties and methods attached to the entity.

## PROPERTIES

These are properties that are defined on the ent object:

- `mold` (str): This identifies the mold which defines the entity's actions.
- `signature` (num or str): Identifier for the entity.
- `fingerprint` (str): The mold/signature combination that defines this ent
- `world` (obj): A circular reference to the world that the entity is a part of.

## METHODS

These are the methods of the ent object:

- `act` (fun): Calls an action defined by the mold of the ent.
- `watch` (fun): Allows another entity or script to bind to the signals emitted by this entity.

## MOLD

Define entity actions inside of molds. To learn how to define a mold, read [molds](docs/molds.md).

## ACTIONS

Each ent has a set of actions defined by its mold. To learn how to define and use actions, check out [actions](docs/actions.md).
