//Grunt is just JavaScript running in node, after all...
module.exports = function(grunt) {
// All upfront config goes in a massive nested object.
  grunt.initConfig({
    // You can set arbitrary key-value pairs.
    srcFolder: 'app',
    destFolder: 'dist',
    distFolder: 'scripts',
    configFolder: 'config',
    // You can also set the value of a key as parsed JSON.
    // Allows us to reference properties we declared in package.json.
    pkg: grunt.file.readJSON('package.json'),
    // Grunt tasks are associated with specific properties.
    // these names generally match their npm package name.
    concat: {
      // Specify some options, usually specific to each plugin.
      options: {
        // Specifies string to be inserted between concatenated files.
        separator: ';'
      },
      // 'dist' is what is called a "target."
      // It's a way of specifying different sub-tasks or modes.
      dist: {
        // The files to concatenate:
        // Notice the wildcard, which is automatically expanded.
        src: ['<%= srcFolder %>/scripts/*.js'],
        // The destination file:
        // Notice the angle-bracketed ERB-like templating,
        // which allows you to reference other properties.
        // This is equivalent to 'dist/main.js'.
        dest: '<%= distFolder %>/main.js'
        // You can reference any grunt config property you want.
        // Ex: '<%= concat.options.separator %>' instead of ';'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: [
          {expand: true, src: '<%= srcFolder %>/scripts/*.js', dest: '<%= destFolder %>', ext: '.min.js'},
          {expand: true, src: '<%= srcFolder %>/scripts/**/*.js', dest: '<%= destFolder %>', ext: '.min.js'}
        ]
      }
    },
    cssmin: {
      target: {
        files: [
          {expand: true, src: '<%= srcFolder %>/css/style.css', dest: '<%= destFolder %>', ext: '.min.css'}
        ]
      }
    },
    minifyHtml: {
      options: {
        cdata: true
      },
      dist: {
        files: [
          {expand: true, src: '<%= srcFolder %>/*.html', dest: '<%= destFolder %>', ext: '.html'},
          {expand: true, src: '<%= srcFolder %>/**/*.html', dest: '<%= destFolder %>', ext: '.html'}
        ]
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, src: '<%= srcFolder %>/css/*', dest: '<%= destFolder %>'},
          {expand: true, src: '<%= srcFolder %>/fonts/*', dest: '<%= destFolder %>'},
          {expand: true, src: '<%= srcFolder %>/images/*', dest: '<%= destFolder %>'},
          {expand: true, src: '<%= srcFolder %>/scripts/lib/*', dest: '<%= destFolder %>'},
          {expand: true, src: '<%= srcFolder %>/scripts/*.json', dest: '<%= destFolder %>'}
        ]
      },
      config: {
        files: [
           {expand: true, flatten: true, src: '<%= configFolder %>/*', dest: '<%= destFolder %>/'},
        ]
      }
    },
    clean: {
      build: {
        src: ['<%= destFolder %>/scripts/*', '<%= destFolder %>/css/*', '<%= destFolder %>/images/*', '<%= destFolder %>/*.html']
      }
    },
    jshint: {
      // define the files to lint
      files: ['scripts/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }
  }); // The end of grunt.initConfig

  // We've set up each task's configuration.
  // Now actually load the tasks.
  // This will do a lookup similar to node's require() function.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-minify-html');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  //grunt.loadNpmTasks('grunt-contrib-concat');
  //grunt.loadNpmTasks('grunt-jsonlint');

  // Register our own custom task alias.
  grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'minifyHtml', 'copy']);
};