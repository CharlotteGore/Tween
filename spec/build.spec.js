describe("Test platform validation", function(){

	it("Require exists", function(){

		expect(require).toBeDefined();

	});

	it("The module can be required", function(){

		expect(require('tween')).toBeDefined();

	});

});

describe("Tween module", function(){

	describe("From", function(){

		var Tween = require('tween').Tweening;

		it("Can be initialised with an object", function(){

			var obj = {
				left : 10,
				top : 20
			};

			var tween = Tween(obj).query();

			expect(tween.left.start).toBe(10);
			expect(tween.top.start).toBe(20);	


		});

		it("Can be initialised with a CSS hex string", function(){

			var string = "#FFDE00";

			var tween = Tween(string).query();

			expect(tween.r.start).toBe(255);
			expect(tween.g.start).toBe(222);
			expect(tween.b.start).toBe(0);
			expect(tween.a.start).toBe(1);

		});

		it("Can be initialised with a number", function(){

			var number = 234;

			var tween = Tween(number).query();

			expect(tween.tween.start).toBe(234);

		});

		it("Can be initialised without parameters", function(){

			var tween = Tween().query();

			expect(tween.tween.start).toBe(0);

		});

		it("has a working .from() method", function(){

			var tween = Tween().from({ left : 10, top : 20}).query();
			expect(tween.left.start).toBe(10);

			var tween = Tween().from("#FFDE00").query();
			expect(tween.r.start).toBe(255);
			expect(tween.g.start).toBe(222);

			var tween = Tween().from(234).query();
			expect(tween.tween.start).toBe(234);
		});


	});

	describe("To (destination)", function(){

		var Tween = require('tween').Tweening;

		it("can take an object for to()", function(){

			var tween = Tween({ left : 10, top : 20}).to({ left : 100, top : 200}).query();

			expect(tween.left.end).toBe(100);
			expect(tween.top.end).toBe(200);

		})

		it("can take a CSS hex string for to()", function(){

			var tween = Tween("#FFDE00").to("#DEFF99").query();

			expect(tween.r.end).toBe(222);
			expect(tween.g.end).toBe(255);
			expect(tween.b.end).toBe(153);

		})

		it("can take a raw number for to()", function(){

			var tween = Tween(235).to(1543).query();

			expect(tween.tween.end).toBe(1543);


		})

	});


	describe("Using (easing functions)", function(){

		var Tween = require('tween').Tweening;

		it("has a with method", function(){

			var tween = Tween();

			expect(tween.using).toBeDefined();

		});

		it("has a valueAtTime() method", function(){

			var tween = Tween();

			expect(tween.valueAtTime).toBeDefined();

		});	

		it("Can use an easing preset", function(){

			var tween = Tween({ left : 10, top : 20})
							.to({ left : 100, top : 200})
							.using("ease-out");

			// this is sort of testing the easer function, inadvertently.
			// Really we're just testing it's using the *right* easing function.

			var result = tween.valueAtTime(0);

			expect(result.left).toBe(10);
			expect(result.top).toBe(20);


			result = tween.valueAtTime(1);

			expect(result.left).toBe(100);
			expect(result.top).toBe(200);	

			result = tween.valueAtTime(0.5);

			expect(result.left).toBe(82.84375);
			expect(result.top).toBe(165.6875);				

		});

		it("Can use  CSS3 Curve", function(){

			var tween = Tween({ left : 10, top : 20})
							.to({ left : 100, top : 200})
							.using([0.015,0.83,0.375,0.995]);

			var result = tween.valueAtTime(0);

			expect(result.left).toBe(10);
			expect(result.top).toBe(20);


			result = tween.valueAtTime(1);

			expect(result.left).toBe(100);
			expect(result.top).toBe(200);	

			result = tween.valueAtTime(0.5);

			expect(result.left).toBe(82.84375);
			expect(result.top).toBe(165.6875);	

		});	

		it("Can use a full custom curve", function(){

			// { c1 : [0,0], c2 : [0.015,0.83], c3 : [0.375,0.995], c4 : [1,1]}
			var tween = Tween({ left : 10, top : 20})
							.to({ left : 100, top : 200})
							.using({ c1 : [0,0], c2 : [0.015,0.83], c3 : [0.375,0.995], c4 : [1,1]});

			var result = tween.valueAtTime(0);

			expect(result.left).toBe(10);
			expect(result.top).toBe(20);


			result = tween.valueAtTime(1);

			expect(result.left).toBe(100);
			expect(result.top).toBe(200);	

			result = tween.valueAtTime(0.5);

			expect(result.left).toBe(82.84375);
			expect(result.top).toBe(165.6875);						

		});

		it("Returns correct easing values when reversed", function(){

			var tween = Tween({ left : 10, top : 20})
							.to({ left : 100, top : 200})
							.using("ease-out");

			// this is sort of testing the easer function, inadvertently.
			// Really we're just testing it's using the *right* easing function.

			var result = tween.valueAtTime(0, true);

			expect(result.left).toBe(100);
			expect(result.top).toBe(200);


			result = tween.valueAtTime(1, true);

			expect(result.left).toBe(10);
			expect(result.top).toBe(20);	

			result = tween.valueAtTime(0.5, true);

			expect(result.left).toBe(27.156250000000004);
			expect(result.top).toBe(54.31250000000001);	


		});

	});

	describe("Setting callbacks and triggering", function(){

		var Tween = require('tween').Tweening;

		var flag, value;

		it("Can set a 'begin' callback with onBegin()", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out');
			var begin = jasmine.createSpy();

			tween.onBegin(begin);

			tween.trigger('begin');

			expect(begin).toHaveBeenCalled();


		});

		it("Can set a 'tick' callback with onTick()", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out');
			var tick = jasmine.createSpy();

			tween.onTick(tick);

			tween.trigger('tick', 0.5);

			expect(tick).toHaveBeenCalledWith(0.5);


		});

		it("Can set a 'finish' callback with onFinish()", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out');
			var finish = jasmine.createSpy();

			tween.onFinish(finish);

			tween.trigger('finish');

			expect(finish).toHaveBeenCalled();


		});

		it("Can set a 'finish' callback with on('finish')", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out');
			var finish = jasmine.createSpy();

			tween.on("finish", finish);

			tween.trigger('finish');

			expect(finish).toHaveBeenCalled();


		});


	});

	describe("Duration", function(){

		var Tween = require('tween').Tweening;

		it("has a duration method", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out');

			expect(tween.duration).toBeDefined();


		});

		it("can accept a number (milliseconds)", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration(1000);

			expect(tween._duration).toBe(1000);

		});

		it("can accept strings with seconds", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration('1s');

			expect(tween._duration).toBe(1000);

		});

		it("can accept strings with milliseconds", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration('100ms');

			expect(tween._duration).toBe(100);

		});	

		it("can accept strings with minutes", function(){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration('1m');

			expect(tween._duration).toBe( 1000 * 60 );

		});	

	});


});

