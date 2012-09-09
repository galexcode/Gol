/*global module:false*/
module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-coffeelint');
  // Project configuration.
  grunt.initConfig({
    pkg: '<json:gol.jquery.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js@'
      }
    },
    watch: {
      files: '<config:coffeelint.files>',
      tasks: 'coffeelint coffee'
    },
    coffee: {
      app: {
        src: ['app/**/*.coffee'],
        dest: 'src/'
      }
    }, 
    coffeelint: {
      files: ['app/**/*.coffee'] 
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'coffeelint coffee watch');

};
