var easing = require('easing'),
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

var Tween = function( startStates ){

	this.tweens = {};
	this._duration = 1000;
	this.from( startStates );
	this.callbacks = {
		"tick" : function(){},
		"begin" : function(){},
		"finish" : function(){}
	};

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

		return this;

	},

	using : function( config ){

		var self = this;

		if( is.string( config ) ){

			if( easing.isPreset( config ) ){

				each( self.tweens, function( tween, key ){

					// forward and back
					tween.forward = easing.Ease(tween.start).to(tween.end).using( config );
					tween.back = easing.Ease(tween.end).to(tween.start).using( config );

				});

			} else {

				var err = "Sorry, invalid easing. The options are: "

				each(easing.presets, function( value ){

					err += value + " ";

				});

				throw new Error( err );

			}

		}else if( is.array( config ) && config.length === 4 ){

			each( self.tweens, function( tween, key ){

				// forward
				var temp = easing.Ease(tween.start).to(tween.end)
				tween.forward = temp.usingCSS3Curve.apply(temp, config);

				// back
				temp = easing.Ease(tween.end).to(tween.start);
				tween.back = temp.usingCSS3Curve.apply(temp, config);

			});

		}else if( is.object( config ) && is.array( config.c1 ) && is.array( config.c2 ) && is.array( config.c3) && is.array( config.c4 ) ){

			each( self.tweens, function( tween, key ){

				tween.forward = easing.Ease(tween.start).to(tween.end).usingCustomCurve(config);
				tween.back = easing.Ease(tween.end).to(tween.start).usingCustomCurve(config);

			});

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

		if(this.tweens){

			each(this.tweens, function(tween, id){

				if(!reverse){

				result[id] = tween.forward.valueAtTime( time );

				}else{

				result[id] = tween.back.valueAtTime( time );

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