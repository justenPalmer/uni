# uni tutorial (INCOMPLETE)

## SETUP

First create a new directory for your new project.

```
mkdir fooSay
cd fooSay
```

Bring in Uni.

```

vim uni.js

```

Paste in the code from [/dist/uni.min.js](source). 

Make the index.html file.

```

vim index.html

```

Paste in the following html boilerplate (press 'i' for insert):

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Hello World</title>
	</head>
	<body>
		Hello World
		<script src="uni.js" type="text/javascript"></script>
		<script type="javascript">

			/**** start scripting here ****/
			
		</script>
	</body>
</html>
```

## DEFINE MOLDS

``` javascript

	var foo = uni.mold('foo'); // get the mold
	foo.act('say',function(pack,done){ // define the action
		var ent = this, world = ent.world; // convenience handles

		/**** do stuff here *****/
		var msg = new SpeechSynthesisUtterance(pack);
		window.speechSynthesis.speak(msg);

		return done.pass(); // every action must call done.pass or done.fail
	});
	
```

## MAKE THE WORLD

``` javascript

	var world = uni.world();

```

## USE ENT TO DO ACTION

``` javascript

	world.ent('foo').act('say','bar');

```

## ALL TOGETHER

```html

<!DOCTYPE html>
<html>
    <head>
        <title>Hello World</title>
	</head>
	<body>
		Hello World
		<script src="uni.js" type="text/javascript"></script>
		<script type="javascript">
			var foo = uni.mold('foo'); // get the mold
			foo.act('say',function(pack,done){ // define the action
				var ent = this, world = ent.world; // convenience handles

				/**** do stuff here *****/
				var msg = new SpeechSynthesisUtterance(pack);
				window.speechSynthesis.speak(msg);

				return done.pass(); // every action must call done.pass or done.fail
			});

			var world = uni.world();
			world.ent('foo').act('say','uni is alive!');
		</script>
	</body>
</html>

```


