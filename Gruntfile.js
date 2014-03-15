module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		mocha_phantomjs : {
			options : {
				'reporter' : 'spec'		
			},
			all : ['test/**/*.html']
		},
		jshint : {
			files : ['index.js']			
		},
		shell : {
			install : {
				command : './node_modules/.bin/component install',
				options : {
					stdout : true,
					stderr : true

				}
			},
			build : {
				command : './node_modules/.bin/component build',
				options : {
					stdout : true,
					stderr : true

				}
			},
			installWin : {
				command : 'sh ./node_modules/.bin/component install',
				options : {
					stdout : true,
					stderr : true
				}

			},
			buildWin : {
				command : 'sh ./node_modules/.bin/component build',
				options : {
					stdout : true,
					stderr : true

				}

			}
		},
		watch : {
			win : {
				files : ["index.js", "local/*.js"],
				tasks : ['shell:buildWin', 'mocha_phantomjs']	
			},	
			posix : {
				files : ["index.js", "local/*.js"],
				tasks : ['shell:build', 'mocha_phantomjs']			
			}		
		}
	});
	grunt.loadNpmTasks('grunt-mocha-phantomjs');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', 'shell:build');
	grunt.registerTask('install', 'shell:install');
	grunt.registerTask('install-win', 'shell:installWin');
	grunt.registerTask('build-win', 'shell:buildWin');

	grunt.registerTask("install-build-test", ["shell:install", "shell:build", "mocha_phantomjs"]);

	grunt.registerTask('test', 'mocha_phantomjs');
}
