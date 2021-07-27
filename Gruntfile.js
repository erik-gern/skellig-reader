const sass = require('sass');

module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ['build/*', 'dist/*', '!build/.gitignore', '!dist/.gitignore'],
		copy: {
			main: {
				files: [ 
					{ expand: true, cwd: 'static', src: '**', dest: 'build/', } 
				],
			},
			ipcSpec: {
				files: [{ src: 'src/ipc/ipc-spec.yaml', dest: 'dist/ipc/ipc-spec.yaml' }],
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
				options: {
					transform: [
						'brfs',
					],
				},
			},
		},
		mochaTest: {
			test: {
				src: ['test/**/*.js']
			}
		},
		watch: {
			scripts: {
				files: 'src/**/*.ts',
				tasks: ['ts', 'browserify'],
				options: {
					interrupt: true,
					debounceDelay: 1000,
					livereload: true,
				},
			},
			styles: {
				files: ['scss/**/*.scss'],
				tasks: ['sass'],
				options: {
					interrupt: true,
					debounceDelay: 1000,
					livereload: true,
				},
			},
		},
	});
	
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-ts');
	
	grunt.registerTask('build', ['clean', 'copy:main', 'sass', 'ts', 'copy:ipcSpec', 'browserify']);
	grunt.registerTask('test', ['mochaTest']);
		
};