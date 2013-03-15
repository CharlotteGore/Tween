var easing = require('easing').Ease,
	Bezier = require('bezier'),
	is = require('is'),
	each = require('each'),
	colorParse = require('color-parser'),
	parseDuration = require('parse-duration'),
	tick = require('tick');


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

			tween.path = Bezier().c1([0,tween.start]).c2([0, tween.end]).isLinear();

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

				throw new Error("Invalid easing");

			}

		}else if( is.array( config ) && config.length === 4 ){

			var temp = easing();
			self._easer = temp.usingCSS3Curve.apply(temp, config);

		}else if( is.object( config ) && is.array( config.c1 ) && is.array( config.c2 ) && is.array( config.c3) && is.array( config.c4 ) ){

			self._easer = easing().usingCustomCurve(config);

		}else {

			throw new Error("Invalid easing");

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
	tick : function( callback ){

		this.callbacks.tick = callback;
		return this;

	},

	begin : function( callback ){

		this.callbacks.begin = callback;
		return this;

	},

	finish : function( callback ){

		this.callbacks.finish = callback;
		return this;

	},

	query : function(){

		return {
			easer : this._easer,
			duration : this._duration,
			tweens : this.tweens
		}

	},
	// debug method
	valueAtTime : function( time, reverse ){

		var result = {};
		var val = this._easer( time );

		if(this.tweens){

			each(this.tweens, function(tween, id){
				result[id] = tween.path.yAtTime( val );
			})

		}

		return result;

	},

	play : function(){

		var self = this;

		self.handle = tick.add( function( elapsed, stop ){

			var percent = Math.min(1, elapsed / self._duration);

			self.callbacks.tick( self.valueAtTime( percent ) ); 

			if(percent === 1){

				stop();
				self.callbacks.finish( tick.now() );

			}

		});

		self.callbacks.begin( tick.now() );

		return this;

	},

	stop : function(){

		if(self.handle){

			self.handle.stop();

		}

		return this;

	}

}

module.exports.Tweening = function( config ){

	return new Tween(config);

}