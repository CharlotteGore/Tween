describe("Test platform validation", function (){

	it("Require exists", function (){

		expect(require).to.be.ok;

	});

	it("The module can be required", function (){

		expect(require('tween')).to.be.ok;
	});

	it("The module can be required", function (){

		expect(require('tween').Tween).to.be.ok;
	});

});

describe("Tween module", function (){

	describe("new Tween()", function(){

		it("creates a tweening object with the new keywork", function (){

			var Tween = require('tween').Tween;

			var tween = new Tween({ a : 3.14 });

			expect(tween.query().tweens.a.start).to.equal(3.14);

		});

	});

	describe("From", function (){

		var Tween = require('tween').Tweening;

		it("Can be initialised with an object", function (){

			var obj = {
				left : 10,
				top : 20
			};

			var tween = Tween(obj).query().tweens;

			expect(tween.left.start).to.equal(10);
			expect(tween.top.start).to.equal(20);	


		});

		it("Can be initialised with a CSS hex string", function (){

			var string = "#FFDE00";

			var tween = Tween(string).query().tweens;

			expect(tween.r.start).to.equal(255);
			expect(tween.g.start).to.equal(222);
			expect(tween.b.start).to.equal(0);
			expect(tween.a.start).to.equal(1);

		});

		it("Can be initialised with a number", function (){

			var number = 234;

			var tween = Tween(number).query().tweens;

			expect(tween.tween.start).to.equal(234);

		});

		it("Can be initialised without parameters", function (){

			var tween = Tween().query().tweens;

			expect(tween.tween.start).to.equal(0);

		});

		it("Can be initialised with an array", function (){

			var tween = Tween([3,4,5]).query().tweens;

			expect(tween[0].start).to.equal(3);
			expect(tween[1].start).to.equal(4);
			expect(tween[2].start).to.equal(5);

		});

		it("has a working .from() method", function (){

			var tween = Tween().from({ left : 10, top : 20}).query().tweens;
			expect(tween.left.start).to.equal(10);

			var tween = Tween().from("#FFDE00").query().tweens;
			expect(tween.r.start).to.equal(255);
			expect(tween.g.start).to.equal(222);

			var tween = Tween().from(234).query().tweens;
			expect(tween.tween.start).to.equal(234);
		});


	});

	describe("To (destination)", function (){

		var Tween = require('tween').Tweening;

		it("can take an object for to()", function (){

			var tween = Tween({ left : 10, top : 20}).to({ left : 100, top : 200}).query().tweens;

			expect(tween.left.end).to.equal(100);
			expect(tween.top.end).to.equal(200);

		})

		it("can take a CSS hex string for to()", function (){

			var tween = Tween("#FFDE00").to("#DEFF99").query().tweens;

			expect(tween.r.end).to.equal(222);
			expect(tween.g.end).to.equal(255);
			expect(tween.b.end).to.equal(153);

		})

		it("can take a raw number for to()", function (){

			var tween = Tween(235).to(1543).query().tweens;

			expect(tween.tween.end).to.equal(1543);


		})

		it("can take an array", function (){

			var tween = Tween([100,200]).to([200,100]).query().tweens;

			expect(tween[0].end).to.equal(200);
			expect(tween[1].end).to.equal(100);

		})

	});


	describe("Using (easing functions)", function (){

		var Tween = require('tween').Tweening;

		it("has a 'using' method", function (){

			var tween = Tween();

			expect(tween.using).to.be.ok;

		});

		it("has a valueAtTime() method", function (){

			var tween = Tween();

			expect(tween.valueAtTime).to.be.ok;

		});	

		it("Can use an easing preset", function (){

			var tween = Tween({ left : 10, top : 20})
							.to({ left : 100, top : 200})
							.using("ease-out");

			// this is sort of testing the easer function, inadvertently.
			// Really we're just testing it's using the *right* easing function.

			var result = tween.valueAtTime(0);

			expect(result.left).to.equal(10);
			expect(result.top).to.equal(20);


			result = tween.valueAtTime(1);

			expect(result.left).to.equal(100);
			expect(result.top).to.equal(200);	

			result = tween.valueAtTime(0.5);

			expect(result.left).to.be.within(71, 72);
			expect(result.top).to.be.within(143, 144);				

		});

		it("Can use  CSS3 Curve", function (){

			var tween = Tween({ left : 10, top : 20})
							.to({ left : 100, top : 200})
							.using([0.015,0.83,0.375,0.995]);

			var result = tween.valueAtTime(0);

			expect(result.left).to.equal(10);
			expect(result.top).to.equal(20);


			result = tween.valueAtTime(1);

			expect(result.left).to.equal(100);
			expect(result.top).to.equal(200);	

			result = tween.valueAtTime(0.5);

			expect(result.left).to.equal(94.14583556883085);
			expect(result.top).to.equal(188.2916711376617);	

		});	

		it("Can use a full custom curve", function (){

			// { c1 : [0,0], c2 : [0.015,0.83], c3 : [0.375,0.995], c4 : [1,1]}
			var tween = Tween({ left : 10, top : 20})
							.to({ left : 100, top : 200})
							.using({ c1 : [0,0], c2 : [0.015,0.83], c3 : [0.375,0.995], c4 : [1,1]});

			var result = tween.valueAtTime(0);

			expect(result.left).to.equal(10);
			expect(result.top).to.equal(20);


			result = tween.valueAtTime(1);

			expect(result.left).to.equal(100);
			expect(result.top).to.equal(200);	

			result = tween.valueAtTime(0.5);

			expect(result.left).to.be.within(82, 83);
			expect(result.top).to.be.within(165, 166);						

		});


	});

	describe("Setting callbacks and triggering", function (){

		var Tween = require('tween').Tweening;

		var begin, tick, tween, flag;

		it("Can play() animation calling the set tick handler", function (done){

			tween = Tween({left : 10}).to({left : 100}).duration('100').using('linear');
			count = 0;

			tween.tick(function (){

				count++;

			});
			tween.finish(function (){

				expect(count).to.be.within(1, 5);

				done();

			})
			tween.play()

		});

		it("Can set a 'begin' and 'finish' callback which fire properly", function (done){

			tween = Tween({left : 10}).to({left : 100}).duration('100').using('linear');

			var begin = false;

			tween.begin(function (){

				begin = true;

			});

			tween.finish(function (){

				expect(begin).to.equal(true);
				done();

			})

			tween.play()

		});

	});

	describe("Duration", function (){

		var Tween = require('tween').Tweening;

		it("has a duration method", function (){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out');

			expect(tween.duration).to.be.ok;


		});

		it("can accept a number (milliseconds)", function (){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration(1000).query();

			expect(tween.duration).to.equal(1000);

		});

		it("can accept strings with seconds", function (){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration('1s').query();

			expect(tween.duration).to.equal(1000);

		});

		it("can accept strings with milliseconds", function (){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration('100ms').query();

			expect(tween.duration).to.equal(100);

		});	

		it("can accept strings with minutes", function (){

			var tween = Tween({left : 10}).to({left : 100}).using('ease-out').duration('1m').query();

			expect(tween.duration).to.equal( 1000 * 60 );

		});	

	});


});

