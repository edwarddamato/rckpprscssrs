/// <binding ProjectOpened='watch' />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/

module.exports = function (grunt) {
    grunt.initConfig({
        // JS uglification (and compression)
        uglify: {
            options: {
                mangle: true,
                compress: true,
            },
            rel: {
                files: {
                    'lib/js/main.js': ['assets/js/libs/*.js', 'assets/js/starter.js']
                }
            }
        },
        // SASS compilation
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'lib/css/main.css': 'assets/css/main.scss'
                }
            }
        },
        // watch task which watches .JS/.SCSS files and executes SASS and UGLIFY
        watch: {
            css: {
                files: 'assets/css/**/*.scss',
                tasks: ['sass']
            },
            js: {
                files: 'assets/js/**/*.js',
                tasks: ['uglify']
            }
        }
    });

    // load the plugin that provides the relevant tasks.
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
