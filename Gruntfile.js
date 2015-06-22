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
  			prod: ["<%= dir.prod %>/**/*.js", "<%= dir.prod %>/**/*.css", "<%= dir.prod %>/**/*.jpg", "<%= dir.prod %>/**/*.html", "<%= dir.prod %>/**/*.php", "<%= dir.prod %>/**/*.gif", "<%= dir.prod %>/**/*.png"],
  			stage: ["<%= dir.stage %>/**/*.js", "<%= dir.stage %>/**/*.css", "<%= dir.stage %>/**/*.jpg", "<%= dir.stage %>/**/*.html", "<%= dir.stage %>/**/*.php", "<%= dir.stage %>/**/*.gif", "<%= dir.stage %>/**/*.png"]
		},
		//copies files to another folder
		copy: {
			stage: {
				files: [
			    	{expand: true, src: ['img/**'], dest: '<%= dir.stage %>/'}
			    ],
			},
			prod: {
				files: [
			    	{expand: true, src: ['img/**'], dest: '<%= dir.prod %>/'}
			    ],
			}
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
					bundleExec: false,
					httpImagesPath: 'img',
					imagesDir: 'img/',
					// fontsDir: 'assets-stage.workday.com',
					httpPath: 'localhost/prototype'
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
					bundleExec: false,
					httpImagesPath: 'img',
					imagesDir: 'img',
					// fontsDir: 'assets-stage.workday.com',
					httpPath: '//thewestwindproject.com'
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
					'<%= dir.stage %>/js/prototype-head.js': ['src/js/vendor/modernizr-2.8.3.js'],
					'<%= dir.stage %>/js/prototype-global.js': ['src/js/vendor/jquery-1.11.2.js', 'src/js/main.js', 'src/js/components/*.js'],
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
		        	includePath: 'includes',
		        	//banner: '<%= banner %>',
		        }
      		},
      		prod: {
        		cwd: 'page_templates',
        		src: [ '*.php'],
        		dest: '<%= dir.prod %>/',
		        options: {
		        	includePath: 'includes',		        	
		        	flatten: true,
		        }
      		},
		},

		//watches files and runs tasks when files are saved
		watch: {
			css: {
				files: ['src/scss/**'],
				tasks: ['scsslint', 'compass:stage', 'compass:prod', 'copy:stage', 'copy:prod']
			},
			compass: {
				files: ['**/*.scss'],
				tasks: ['compass:stage', 'compass,prod']
			},
			js: {
				files: ['src/js/**/*.js'],
				tasks: ['concat:js', 'uglify:js', 'copy:stage', 'copy:prod']
			},
			html: {
				files: ['page_templates/**', 'includes/**',],
				tasks: ['includes']
			},
			options: {
				 dateFormat: function(time) {
			      grunt.log.writeln(time + 'ms at ' + (new Date()).toString());
			      grunt.log.writeln('Waiting for more changes...');
			    },
			}
		},

		scsslint: {
			options: {
				bundleExec: false,
				colorizeOutput: true,
				config: '.scss-lint.yml',
				  // maxBuffer: 1024 * 1024,
				  force: true
			},
			src: [
				'scss/components/**/*.scss', 'scss/styles.scss'
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
	grunt.registerTask('build', ['clean:prod', 'copy:prod', 'copy:stage', 'clean:stage', 'compass:stage', 'compass:prod', 'concat:js', 'uglify:js', 'includes']);
	grunt.registerTask('default', ['watch']);
};
