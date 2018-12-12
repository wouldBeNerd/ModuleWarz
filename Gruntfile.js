'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // BROWSERIFY
    browserify: {
      client: {
        options: {
          browserifyOptions: {
             debug: true
          }
        },
        files: {
          './JS/indexCode.js': ['JS Snippets/**/*.js']
        }
      }
    },

    // WATCH
    watch: {
      options: {
        livereload: true
      },
      client: {
        files:['JS Snippets/**/*.js','JSON/**/*.json','CSS/**/*.css','*.html'],
        tasks: ['browserify']
      }
    }
  });

  // Load contrib tasks...
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  // Register tasks aliases...
  grunt.registerTask('default','RUN EVERYTHING :-)',['browserify','watch']);
 
};
