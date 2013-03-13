# Tween

CommonJS Animation Utility.

Every few years I seem to have another crack at writing some kind of animation utility. With new sub-millisecond timings available to decent browsers and CommonJS taking off, it made sense to do something better suited to the modern world. I was never happy with the jQuery style object configuration of tweens.

Tween takes advantage of ["Render-Loop"](http://github.com/CharlotteGore/render-loop), which is a central, single animation loop that offers sub-millisecond timings and task scheduling for all animations to hook into and use.

It also uses ["Easing"](http://github.com/CharlotteGore/easing). I took the old Bezier Curve based easing and turned it into a standalone module that could take user configurable normalised cubic bezier curves that match the way easing can be customised for CSS3.

Inspired by ["Component/Tween"](http://github.com/component/tween) I shamelessly borrowed their concept of tweening objects rather than single values. So, you can do:

    require('tween').Tweening({ left : 0, top: 0}).To({ left : 100, top : 100 })

and, in your tick callback, you get `values = { left : 45.4554, top : 45.4554 }` which, handily, you can do something like `$( someElement ).css( values )`; 

Even better, and I think this is pretty nifty, you can do:

    require('tween').Tweening('#FF0000').To('#F8E423')

and, in your tick callback you get `values = { r : 254, g : 156, b : 34 }` . I guess it would be nice if it also had a hex string ready to go, but that's for another day.

Note, also, vaguely fluent interface. Configure your tween with method calls. Easier to remember. Various IDE tools can help you out, too. 

## Features

- Low level, framework / DOM neutral.
- Async onBegin, onEnd and onTick() callbacks to apply returned values to useful work.
- Ultra slinky cubic bezier curve based easing. Many presets and compatible with CSS3 cubic bezier curves.
- Frame skipping / Progressive enhancement. Animations last the duration specified, and get smoother as the browser allows
- Full cross-browser support.
- Sub millisecond timings for better, smoother animations on decent browsers
- Crappy setTimeout fallback for browsers that should know better
- Fluent interface

## Installation

    $ component install charlottegore/tween

## API

### .Tweening( `from` )

    var tween = require('tween').Tweening({ left: 10 });

  create a new Tween object. Optionally takes a 'from' key-value pair that represents the start values for the tween.

  Can also take a string representing a colour, which will generate an object with r, g, b and a properties for tweening.

## Tween Object API

### .from( `keyvaluepairs` || `color string` )

    tween.from({ left : 10, top : 10 })

  If you forgot or don't like setting the from values when creating the Tween object, this method is for you.

  Can also take a string representing a colour, which will generate an object with r, g, b and a properties for tweening.

### .to( `keyvaluepairs` || `colour string` )

    tween.to({ left: 100, top: 50 })

  Every tween needs a start and an end. Set the end values here. 

### .with( `easing` )

  All the functionality in the Easing module is exposed here, but luckily the API is a lot simpler.

    var tween = require('tween').Tweening;

    // with preset... 
    var myTween = tween({ left : 10}).to({ left : 100 }).with('ease-in');

    // or with CSS3 cubic bezier curve data.. 
    var myTween = tween({left : 10}).to({ left : 100}).with([0.015,0.83,0.375,0.995]) 

    // or with a full cubic bezier curve..
    var myTween = tween({left : 10}).to({ left : 100})
      .with({ 
        c1 : [0,0], 
        c2 : [0.015,0.83], 
        c3 : [0.375,0.995], 
        c4 : [1,1]
      })

### .duration( `time` )

  Define how long the animation should take to run. In my experience so far this is more reliable and accurate than system CSS3 animations, but more testing is required to verify this.

  Valid durations are `ms`, `s`, `m`, `h`, `d` and `w`;

    myTween.duration('10s')
    myVeryLongRunningTween.duration('2h')

    // or just direct milliseconds
    myTween.duration(3500)

### .onTick( `callback` )

  Define the callback which will do the actual work required on the tick event. 

    myTween.onTick(function( values ){ 

      element.css(values);

    });

    myOtherTween.onTick(function(values){

      element.style.left = values.left + "px";

    });

### .onBegin( `callback` )

  Simple callback that fires when the animation starts playing. Tween doesn't use the deferred start functionality in Render-Loop yet but this is coming.

### .onEnd( `callback` )

  Simple callback that fires when the animation is done. 

### .play()

  Play the animation immediately.

### .stop()

  Changed your mind? Stop the animation.

### .rewind()

  Play the animation in reverse. Like CSS3 transitions, the easing continues to 'ease out' etc, so not strictly speaking a rewind.

## License

  MIT
