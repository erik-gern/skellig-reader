const sass = require('sass');

module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['build/*', 'dist/*', '!build/.gitignore', '!dist/.gitignore'],
		copy: {
			main: {
				files: [ { expand: true, cwd: 'static', src: '**', dest: 'build/', } ],
			},
		},
		sass: {
			options: {
				implementation: sass,
				sourceMap: true,
			},
			dist: {
				files: {
					'build/styles.css': 'scss/index.scss',
				},
			},
		},
		ts: {
			default: {
				tsconfig: './TSConfig.json'
			}
		},
		browserify: {
			dist: {
				files: {
					'build/ui.js': ['dist/ui.js'],
					'build/preload.js': ['dist/preload.js'],
				},
			},
		},
		mochaTest: {
			test: {
				src: ['test/**/*.js']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-ts');
	
	grunt.registerTask('build', ['clean', 'copy', 'sass', 'ts', 'browserify']);
	grunt.registerTask('test', ['mochaTest']);
		
};