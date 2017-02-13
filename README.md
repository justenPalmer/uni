# uni

Uni is a library which provides a scaffold on which light or enterprise-grade applications may be constructed. The advantages of using Uni are defined below:

- Code organization - Uni allows for a smart separation of responsibilities in code. Chunks of code are defined in molds and are designed to be modular.
- Flexibility - Uni does not enforce any model/view/controller pattern and leaves it up to the coder on which application structure to adopt.
- Data scope - All data within Uni lives inside a world. Within a world data is easily shared and communication flows easily between objects (entities). If a world is destroyed, all data goes with it; therefore the global scope does not get polluted.
- Single dispatch - All method calls go through a single point, making tracking flow of code trivial.
- Unified method signatures - No more looking up method definitions and rewriting them. All methods (actions) in Uni have the exact same signature.
- No prototype chains - Uni speeds up applications by not utilizing prototype chains that are costly for property lookups.
- No complex language - Uni uses only basic javascript syntax; allowing beginners to jump in and veterans to reduce cognitive load.
- Tiny and transparent - Uni is less than 300 lines of code with comments. It does not burden your application with unnecessary weight and should be easy for an intermediate coder to read and understand.
- Immutable classes - All classes (molds) in Uni are unchangable at runtime. This makes behaviors of objects predictable and stable.

## OBJECTIVES

The objective of Uni is to be easy to learn with concepts that can be taught to a beginning coder, flexible so that the potential applications are limitless, and transparent so there is no hidden or abstract functionality. Uni puts the developer in the driver's seat.

## INSTALLATION

To bring Uni into your project, simply copy the file [uni.js](dist/uni.js), paste it into your project, and include the script into the body of your html file.

``` html
<script src="uni.js" type="text/javascript"></script>
```

## CONCEPTS

The concepts of uni:

- [worlds](docs/worlds.md): A world is a container that encapsulates data for an application or part of an application. Data structures (ents) are bound inside a world and can easily talk to and exchange information with entities in the same world.
- [entities](docs/entities.md) (or ents): Entities are the data structures of Uni. Each entity has a unique identity, data scope, and actions which are defined by its mold.
- [molds](docs/molds.md): Molds define the actions that ents can perform. Each ent takes on the actions of one mold.
- [actions](docs/actions.md) (or acts): Entities perform actions to do get things done.
- [signals](docs/signals.md): Signals are events triggered by an entity - other entities can watch for signals.
- [tools](docs/tools.md): Tools are convenience functions used to handle common Uni occurances such as asynchronous actions, loops, and data typing. 

## TUTORIAL

To build your first Uni application, follow the steps in this [tutorial](docs/tutorial.md).
