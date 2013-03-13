var easing = require('easing').Ease,
	Bezier = require('bezier'),
	is = require('is'),
	each = require('each'),
	colorParse = require('color-parser'),
	parseDuration = require('parse-duration'),
	renderLoop = require('render-loop');


var processStates = function( states ){

	if( is.object( states ) ){

		return states;

	} else if( is.string( states ) ){

		var rgb = colorParse( states );

		if(rgb){

			return rgb;

		}else{

			throw new Error("Invalid string input!");

		}

	} else if( is.number( states ) ){

		return {
			tween : states
		}

	}

	// worst case scenario..

	return {
		tween : 0
	}

}

var buildPaths = function(){

	if(this._pathMode==='linear'){

		each(this.tweens, function(tween){

			tween.forward = Bezier().c1([tween.start,0]).c2([tween.end, 0]).isLinear();
			tween.back = Bezier().c1([tween.end, 0]).c2([tween.start, 0]).isLinear();

		});

	}

	return true;

}

var Tween = function( startStates ){

	this.tweens = {};

	this._duration = 1000;

	this._easer = easing().using('linear');
	this._pathMode = 'linear';

	this.callbacks = {
		"tick" : function(){},
		"begin" : function(){},
		"finish" : function(){}
	};

	this.from( startStates );

	return this;
	
};

Tween.prototype = {

	from : function( startStates ){

		var self = this,
			states = processStates( startStates );

		each( states, function( value, key ){

			self.tweens[key] = {
				start : value,
				end : 0
			}

		});

		buildPaths.call(this);

		return this;

	},



	to : function( endStates ){

		var self = this,
			states = processStates( endStates );

		each( states, function( value, key ){

			if(self.tweens[key]){

				self.tweens[key].end = value;

			}else{

				self.tweens[key] = {
					start : 0,
					end : value

				}

			}

		});

		buildPaths.call(this);

		return this;

	},

	using : function( config ){

		var self = this;

		if( is.string( config ) ){

			if( require('easing').isPreset( config ) ){

					// forward and back
					self._easer = easing().using( config );

				

			} else {

				var err = "Sorry, invalid easing. The options are: "

				each(easing.presets, function( value ){

					err += value + " ";

				});

				throw new Error( err );

			}

		}else if( is.array( config ) && config.length === 4 ){

				var temp = easing();
				self._easer = temp.usingCSS3Curve.apply(temp, config);

		}else if( is.object( config ) && is.array( config.c1 ) && is.array( config.c2 ) && is.array( config.c3) && is.array( config.c4 ) ){

			self._easer = easing().usingCustomCurve(config);

		}

		return this;

	},

	duration : function( time ){

		if(time){

			this._duration = parseDuration( time );

		}

		return this;

	},

	// callback helpers
	onTick : function( callback ){

		this.on("tick", callback);

		return this;

	},

	onBegin : function( callback ){

		this.on("begin", callback);

		return this;

	},

	onFinish : function( callback ){

		this.on("finish", callback);

		return this;

	},

	on : function( event, callback ){

		if(this.callbacks[event]){

			this.callbacks[event] = callback;

		}else{

			throw new Error("Unsupported callback. Options are tick, begin and finish.");

		}

		return this;

	},

	trigger : function( event, time ){

		if(this.callbacks[event]){

			this.callbacks[event]( time );

		}

		return this;

	},

	query : function(){

		return this.tweens;

	},

	// debug method
	valueAtTime : function( time, reverse ){

		var result = {};
		var val = this._easer( time );

		if(this.tweens){

			each(this.tweens, function(tween, id){

				if(!reverse){

					result[id] = tween.forward.xAtTime( val );

				}else{

					result[id] = tween.back.xAtTime( val );

				}

			})

		}

		return result;

	},

	play : function( reverse ){

		var self = this;

		var task = renderLoop
			.Task( function( percent ){

				reverse ? self.callbacks.tick( self.valueAtTime( percent, true ) ) : self.callbacks.tick( self.valueAtTime( percent ) )

			})
			.usePercentElapsedRunner()
			.runsFor( self._duration )
			.onStart( self.callbacks.begin )
			.onEnd( self.callbacks.finish )

		self.handle = renderLoop.runNow( task );

		return this;

	},

	stop : function(){

		if(self.handle){

			renderLoop.stop(self.handle);

		}

		return this;

	},

	rewind : function(){

		this.play( true );

		return this;

	}

}

module.exports.Tweening = function( config ){

	return new Tween(config);

}