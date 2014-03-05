'use strict';

module.exports = function (grunt) {

  var pkg = require('./package.json');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');

  var bowerrc = grunt.file.exists('./.bowerrc') ? grunt.file.readJSON('./.bowerrc') : { 'json': 'bower.json' };

  var bumpFiles = [ 'package.json', '../w11k-dropdownToggle-bower/package.json' ];
  if (grunt.file.exists(bowerrc.json)) {
    bumpFiles.push(bowerrc.json);
  }

  grunt.initConfig({
    pkg: pkg,
    meta: {
      banner:
        '/**\n' +
          ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
          ' * <%= pkg.homepage %>\n' +
          ' *\n' +
          ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
          ' */\n'
    },

    clean: {
      dist: 'dist/*'
    },
    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: '**.js'
        }]
      }
    },
    copy: {
      release: {
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: '*',
            dest: '../w11k-dropdownToggle-bower/dist/'
          },
          {
            src: 'bower.json',
            dest: '../w11k-dropdownToggle-bower/'
          }
        ]
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      code: {
        options: {
          mangle: false,
          compress: false,
          beautify: true
        },
        files: {
          'dist/w11k-dropdownToggle.js': 'src/w11k-dropdownToggle.js'
        }
      },
      codeMinified: {
        files: [{
          'dist/w11k-dropdownToggle.min.js': 'src/w11k-dropdownToggle.js'
        }]
      }
    },
    bump: {
      options: {
        files: bumpFiles,
        commit: true,
        commitMessage: 'chore(project): bump version to %VERSION%',
        commitFiles: ['-a'],
        createTag: false,
        push: false
      }
    }
  });


  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', ['clean', 'jshint:src', 'uglify']);

  grunt.registerTask('release', ['build', 'copy:release']);

};
