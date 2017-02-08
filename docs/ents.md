# uni ents

Entities (or ents) are instances of the molds with properties and behaviors. Think about them as individuals with characteristics and behaviors. Each ent has a mold and signature which together comprise the individual's unique fingerprint. Only one ent may exist with a given fingerprint in each world.

## MAKE

Define and retrieve an ent with the following:

``` javascript
var meep = world.ent('meep'); // gets the ent with mold 'meep' and store it into the var meep
var meep1 = world.ent('meep',1); // gets the ent with signature 1 and fingerprint 'meep~1'
```

### parameters
- mold (str): behaviors for this ent are taken from this mold
- signature (num or str): identifier for this ent, only one ent may exist for each mold/signature combination

### return
 - ent (obj): an object of the ent properties

The ent object has the following properties and methods

## Properties

These are properties that are defined on the ent object:

- mold (str): the mold of the ent
- signature (num or str): identifier for this ent
- fingerprint (str): the mold/signature combination that defines this ent
- world (obj): this is a circular reference to the world that the ent was created in

## methods

These are the methods of the ent object:

- act (fun): calls an action defined by the mold of the ent
- watch (fun): binds

## actions

Each ent has a set of behaviors (actions) defined by its mold.
