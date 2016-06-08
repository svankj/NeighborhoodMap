module.exports = function(grunt) {
  var mozjpeg = require('imagemin-mozjpeg');
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-resize-crop');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks("grunt-jsbeautifier");
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-minified');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
  	imagemin: {
    		png: {
      			options: {
        			optimizationLevel: 7
      			},
      			files: [ {
		     		// Set to true to enable the following options…
          			expand: true,
          			// cwd is 'current working directory'
          			cwd: 'images/',
          			src: ['**/*.png'],
          			// Could also match cwd line above. i.e. project-directory/img/
          			dest: 'images/compress/',
          			ext: '.png'
        		}]
	   		},
    	   	jpg: {
      			options: {
        		progressive: true,
			optimizationLevel: 3,
			use: [mozjpeg()]
      			},
      			files: [ {
          			// Set to true to enable the following options…
          			expand: true,
          			// cwd is 'current working directory'
          			cwd: 'images/',
          			src: ['**/*.jpg'],
          			// Could also match cwd. i.e. project-directory/img/
          			dest: 'images/compress',
          			ext: '.jpg'
        		}]
    			},
   	   	svg: {
      			options: {
        		progressive: true,
			optimizationLevel: 3,
			use: [mozjpeg()]
      			},
      			files: [ {
          			// Set to true to enable the following options…
          			expand: true,
          			// cwd is 'current working directory'
          			cwd: 'images/',
          			src: ['**/*.svg'],
          			// Could also match cwd. i.e. project-directory/img/
          			dest: 'images/compress',
          			ext: '.svg'
        		}]
    			}

  	},
	cssmin: {
		target: {
		    files: [{
	            	expand: true,
	            	cwd: 'test/',
      		    	src: ['*.css', '!*.min.css'],
      		    	dest: 'test/',
      		    	ext: '.min.css'
    		    }]
  		}
	},
	responsive_images: {
      		options: {
        		engine: 'im'
      		},
    		myTask: {
      			options: {
        			sizes: [
					{
	 	 			name: "small",
	  				width: 320
	  				//width: '40%',
          				//height: '40%',
	  				//aspectRatio: false,
				  	//gravity: "Center"
        				},
					{
          				name: 'medium',
	  				width: 480
          				//width: '60%',
	  				//height: '60%',
	  				//aspectRatio: false,
	  				//gravity: "Center"
        				},
					{
	  				name: 'large',
	  				width: 800,
	  				//width: 960,
	  				//height: 640,
	  				suffix: "_x1",
	  				quality: 70
					},
					{
          				name: "large",
          				width: 1024,
          				suffix: "_x2",
          				quality: 70
        				}]
      			},
      			files: [{
        			expand: true,
        			src: ['**/*.{jpg,gif,png}'],
        			cwd: 'images/',
        			dest: 'images/compress'
      			}]
    		}
  	},
	resize_crop: {
    		image_group: {
      			options: {
        			format: "jpg",
        			gravity: "center",
        			height: 480, //320,
        			width: 640 //240
      			},
      			files: {
        			'images/compress': [
          				'images/cockatoos.jpg',
          				'images/grasshopper.jpg',
          				'images/horses.jpg',
          				'images/postcard.jpg',
          				'images/sfo.jpg',
          				'images/still_life.jpg',
          				'images/volt.jpg'
        			],
      			},
    		},
  	},
    	svgmin: {
        	options: {
            		plugins: [
       			{
                    	removeViewBox: false
                	}, 
			{
                    	removeUselessStrokeAndFill: false
                	}
            		]
        	},
        	dist: {
            		files: {
                	'images/compress/file.svg': 'images/file.svg'
            		}
        	}
    	},
	jsbeautifier: {
      		files: ["src/**/*.js"],
      			options: {
          			config: "path/to/configFile",
          			html: {
              				braceStyle: "collapse",
              				indentChar: " ",
              				indentScripts: "keep",
              				indentSize: 4,
              				maxPreserveNewlines: 10,
              				preserveNewlines: true,
              				unformatted: ["a", "sub", "sup", "b", "i", "u"],
              				wrapLineLength: 0
          			},
          			css: {
              				indentChar: " ",
              				indentSize: 4
          			},
          			js: {
              				braceStyle: "collapse",
              				breakChainedMethods: false,
              				e4x: false,
              				evalCode: false,
              				indentChar: " ",
              				indentLevel: 0,
              				indentSize: 4,
              				indentWithTabs: false,
              				jslintHappy: false,
              				keepArrayIndentation: false,
              				keepFunctionIndentation: false,
              				maxPreserveNewlines: 10,
              				preserveNewlines: true,
              				spaceBeforeConditional: true,
              				spaceInParen: false,
              				unescapeStrings: false,
              				wrapLineLength: 0,
              				endWithNewline: true
          			}
      			}
  	},
	jshint: {
    		files: ['test/**/*.js']
  	},
	minified : {
  		files: {
    			src: [
    			'test/**/*.js',
    			'test/*.js'
    			],
    			dest: 'test/'
  		},
  		options : {
			// sourcemap: true,
    			ext: '.min.js',
    			allinone: false
  		}
	},
 	htmlmin: { // Task
    		dist: { // Target
      		options: { // Target options
        		removeComments: true,
        		collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true
      		},
      		files: { // Dictionary of files
        	'test/index.html': 'src/index.html' // 'destination': 'source'
      		}
    		}
  	}
  }); // end grunt.initConfig
  grunt.registerTask('default', ['autoprefixer', 'imagemin', 'cssmin', 'responsive_images', 'resize_crop', 'svgmin', 'jsbeautifier', 'jshint', 'minified', 'htmlmin']);
}; // end module.exports
