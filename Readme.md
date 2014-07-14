# Tween

CommonJS Animation Utility. Extensively tested and used in production systems, games, web audio and animation. It is solid. However, this module is no longer being supported as it's been replaced with separate 'Animation Timer', 'Functional Easing' and 'DOM Matrix Transformer' with all other interpolation of values being left to your own implementation. 




## Installation

Browserify/npm

```sh
    $ npm install --save gm-tween
```

```js
  var Tween = require('gm-tween').Tween;
```


Every few years I seem to have another crack at writing some kind of animation utility. With new sub-millisecond timings available to decent browsers and CommonJS taking off, it made sense to do something better suited to the modern world.

Tween takes advantage of ["Tick"](http://github.com/CharlotteGore/tick), which is a central, single animation loop that offers sub-millisecond timings and normalised outputs.

It also uses ["Easing"](http://github.com/CharlotteGore/easing). I took the old Bezier Curve based easing and turned it into a standalone module that could take user configurable normalised cubic bezier curves and, when used in CSS3 Curve mode identically replicates `transition-timing-function: cubic-bezier()` based easing.

Inspired by ["Component/Tween"](http://github.com/component/tween) I shamelessly borrowed their concept of tweening objects rather than single values. So, you can do:

```js
var Tween = require('tween').Tween;
new Tween({ left : 0, top: 0}).to({ left : 100, top : 100 })
```

and, in your tick callback, you get `values = { left : 45.4554, top : 45.4554 }` which, handily, you can do something like `$( someElement ).css( values )`; 

Even better, and I think this is pretty nifty, you can do:

```js
new Tween('#FF0000').to('#F8E423');
```

and, in your tick callback you get `values = { r : 254, g : 156, b : 34 }` . I guess it would be nice if it also had a hex string ready to go, but that's for another day.

Note, also, vaguely fluent interface. Configure your tween with method calls. Easier to remember. Various IDE tools can help you out, too. 

## Updates

- Support for using arrays as your from and to values, and getting arrays back in the tick handle. 
- useDeltas() method gets relative values instead of absolute values
- Tween object exported so you can now do new Tween()

## Features

- Less glitchy and more precise and reliable than CSS3 transitions on Desktop.
- Low level, DOM neutral
- Only 12k built and minified
- Replicates CSS3 cubic-bezier easing exactly in software.
- Async begin, finish and tick callbacks.
- Slinky easing and smooth animation.
- Frame skipping / Progressive enhancement. Animations last the duration specified, and get smoother as the browser allows
- Cross browser support.
- Fluent interface



## API

### new Tween( `from` )

```js
var Tween = require('tween').Tween;
tween = new Tween({ left: 10 });
```

create a new Tween object. Optionally takes a 'from' key-value pair that represents the start values for the tween.

Can also take a string representing a colour, which will generate an object with r, g, b and a properties for tweening, or an array, or a single number.

```js
new Tween([0,1,4]);
new Tween('#ff00ff');
new Tween(45);
```

## Tween Object API

### .from( `keyvaluepairs` || `color string` || `array`)

```js
tween.from({ left : 10, top : 10 })
```

If you forgot or don't like setting the from values when creating the Tween object, this method is for you.

Can also take a string representing a colour, which will generate an object with r, g, b and a properties for tweening.

### .to( `keyvaluepairs` || `colour string` )

```js
tween.to({ left: 100, top: 50 })
```

Every tween needs a start and an end. Set the end values here. Use the same data type as your 'from', hash, array, colour string, etc.

### .using( `easing` )

All the functionality in the Easing module is exposed here, but luckily the API is a lot simpler.

```
// with preset... 
var myTween = new Tween({ left : 10}).to({ left : 100 }).using('ease-in');

// or with CSS3 cubic bezier curve data AND `Y When Xn === t` easing
var myTween = new Tween({left : 10}).to({ left : 100}).using([0.015,0.83,0.375,0.995]) 

// or with a full cubic bezier curve..
var myTween = new Tween({left : 10}).to({ left : 100})
  .using({ 
    c1 : [0,0], 
    c2 : [0.015,0.83], 
    c3 : [0.375,0.995], 
    c4 : [1,1]
  })
```

### .duration( `time` )

Define how long the animation should take to run. In my experience so far this is more reliable and accurate than system CSS3 animations, but more testing is required to verify this.

Valid durations are `ms`, `s`, `m`, `h`, `d` and `w`;

```js
myTween.duration('10s')
myVeryLongRunningTween.duration('2h')
// or just direct milliseconds
myTween.duration(3500)
```

### .useDeltas()

Put this in your chain somewhere and you'll get relative values - changes since last tick instead of absolute values.

Bear in mind it's unlikely that all the deltas will add up exactly, so you may wish to use the 'finish' callback to make sure your tween ends exactly where you want it to end.

### .tick( `callback` )

  Define the callback which will do the actual work required on the tick event. 

```js
myTween.tick(function( values ){ 

  element.css(values);

});

myOtherTween.tick(function(values){

  element.style.left = values.left + "px";

});
```

### .begin( `callback` )

  Simple callback that fires when the animation starts playing.

### .finish( `callback` )

  Simple callback that fires when the animation is done. 

### .play()

  Play the animation immediately.

### .stop()

  Changed your mind? Stop the animation.

## License

  MIT
