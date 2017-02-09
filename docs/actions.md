# uni actions (acts)

Actions are defined by [molds](docs/molds.md) and performed by [entities](docs/entities.md). All public functionality on entities are actions. Actions have a standard signature which makes their definition and use trivial.

Actions are similar to public methods in OOP languages.

## DEFINE

Define an action on a mold. To define an action, a mold must first be defined. Learn how to define molds [here](docs/molds.md). An example of an action definition is below:

``` javascript

mold.act('say',function(pack,done){
	var ent = this;
	var msg = new SpeechSynthesisUtterance(pack);
	window.speechSynthesis.speak(msg);
	return done.pass(msg);
});

```

### Arguments

- `name` (str): A string which acts as a handle to call the action. Action names should be unique within a mold.
- `function` (fun): The function that will be executed when the action is called. This function defines all the functionality of the action. It has two arguments defined below.

## FUNCTION

The function defines the working functionality of the action. All action functions will have two arguments defined.

- `pack` (any): The pack is the data input for the action. Any data to be passed into the action shoud be placed inside the pack. In the case where there is only one data value to be passed, pack may be that data value and take on any type. If there are more data values, pack may be defined as an object containing all the data values.
- `done` (obj): The done object contains two functions, done and fail. One of these should be called when the function is complete.

### Done

All actions should respond to their caller with either a pass or fail. Each action call should result in only one done function being called.

- `pass` (fun): The pass function should be called when the action completes successfully. It takes one argument which should be the return value of the action.
- `fail` (fun): The fail function should be called when the action encounters an error while processing the action. Likely causes of failure are invalid or missing input values, improper entity state, API errors, and DOM related issues.

### This (entity)

The `this` object within an action function is the entity calling the action. The ent will data properties and methods. It will also contain a reference to the world the entity is inside of. For more info, check out [ents](docs/ents.md).
