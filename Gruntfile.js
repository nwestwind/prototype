var timer = require("grunt-timer");

module.exports = function(grunt) {
	timer.init(grunt, { deferLogs: true, friendlyTime: true, color: "red" });
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		banner: '/*! The Westwind Project Protoype <%= grunt.template.today("mm-dd-yy HH:MM:ss") %> */\n\n',

		dir: {
			stage	: '_staging',
			prod 	: '_production'
		},

		//deletes contents of directory
		clean: {
  			prod: ["<%= dir.prod %>/**/*.js", "<%= dir.prod %>/**/*.css", "<%= dir.prod %>/**/*.jpg", "<%= dir.prod %>/**/*.html", "<%= dir.prod %>/**/*.gif", "<%= dir.prod %>/**/*.png"],
  			stage: ["<%= dir.stage %>/**/*.js", "<%= dir.stage %>/**/*.css", "<%= dir.stage %>/**/*.jpg", "<%= dir.stage %>/**/*.html", "<%= dir.stage %>/**/*.gif", "<%= dir.stage %>/**/*.png"]
		},

		//compiles scss to css
		compass: {
			stage: {
				options: {               
					sassDir: 'src/scss',
					cssDir: '<%= dir.stage %>/css',
					noLineComments: false,
					outputStyle: 'nested',
					force: true,
					bundleExec: true,
					httpImagesPath: 'img',
					// imagesDir: 'images-stage.workday.com',
					// fontsDir: 'assets-stage.workday.com',
					// httpPath: '//s3-us-west-2.amazonaws.com'
					// httpFontsPath: '//assets.workday.com/fonts'
				}
		  	},
		  	prod: {
				options: {               
					sassDir: 'src/scss',
					cssDir: '<%= dir.prod %>/css',
					noLineComments: true,
					outputStyle: 'compressed',
					force: true,
					bundleExec: true,
					httpImagesPath: 'img',
					// imagesDir: 'images-stage.workday.com',
					// fontsDir: 'assets-stage.workday.com',
					// httpPath: '//s3-us-west-2.amazonaws.com'
					// httpFontsPath: '//assets.workday.com/fonts'
				}
		  	}		  	
		},

		//concatenates multiple files into one
		concat: {
			js: {
				options: {
					banner: '<%= banner %>',
					separator: ';',
				},
				files: {
					'<%= dir.stage %>/js/prototype-head.js': ['js/vendor/modernizr.js'],
					'<%= dir.stage %>/js/prototype-global.js': ['js/vendor/jquery-2.1.4.min.js', 'js/vendor/jquery-waypoints-3.1.1.js', 'js/prototype-global.js', 'js/components/*.js'],
				}
			}
		},

		//minifies files
		uglify: {
			js: {
				files: {
					'<%= dir.prod %>/js/prototype-head.js': ['<%= dir.stage %>/js/prototype-head.js'],
					'<%= dir.prod %>/js/prototype-global.js': ['<%= dir.stage %>/js/prototype-global.js']
				}
			}
		},
		
		//makes production html files from templates and includes
		includes: {
  			stage: {
        		cwd: 'page_templates',
        		src: [ '*.php'],
        		dest: '<%= dir.stage %>/',
		        options: {
		        	includePath: 'includes'
		        }
      		}
		},

		//watches files and runs tasks when files are saved
		watch: {
			scss: {
				files: ['src/scss/**/*.scss'],
				tasks: ['scsslint', 'compass:prod' /*,'copy:stage'*/]
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['concat:js', 'uglify:js' /*, 'copy:stage'*/]
			},
			html: {
				files: ['page_templates/**', 'includes/**'],
				tasks: ['includes']
			}
		},

		scsslint: {
			options: {
				bundleExec: true,
				colorizeOutput: true,
				config: '.scss-lint.yml',
				  // maxBuffer: 1024 * 1024,
				  force: true
			},
			src: [
				'scss/components/**/*.scss',
				'scss/_typography.scss',
				'scss/prototype-global.scss'
			]
		},
	});

	grunt.loadNpmTasks('grunt-includes');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-scss-lint');
	grunt.loadNpmTasks('grunt-timer');
	//tasks
	grunt.registerTask('build', ['includes:stage', 'clean:prod', 'clean:stage', 'compass:stage', 'compass:prod', 'concat:js', 'uglify:js']);
	grunt.registerTask('default', ['watch']);
};
