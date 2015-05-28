module.exports = function(grunt) {

  // Configurable paths
  var config = {
    js: 'js',
    assets: 'assets',
    css: 'css',
    html: 'html',
    test: 'test',
    build: 'build'
  };

  grunt.initConfig({

    config: config,

    serve: {
      options: {
        port: 9000
      }
    },

    concat: {
      /* Concats all the .js files under /js into nsn.js */
      js: {
        src: ['<%=config.js%>/**/*.js', '!<%=config.js%>/main.js'],
        dest: '<%=config.build%>/js/nsn.js'
      },
    },

    copy: {
      dist: {
        files: [

          /* Main js file which must be loaded first */
          {
            expand: true,
            flatten: true,
            cwd: '<%=config.js%>/',
            src: ['main.js'],
            dest: '<%=config.build%>/js/'
          },

          /* Bower dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.js'],
            dest: '<%=config.build%>/js/lib'
          },

          /* Bower's CSS dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*min.css'],
            dest: '<%=config.build%>/css/lib'
          },
          /* Bower's image dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.png', '**/*.gif'],
            dest: '<%=config.build%>/img/lib'
          },

          /* Project's assets */
          {
            expand: true,
            flatten: false,
            cwd: '<%=config.assets%>/',
            src: ['**/*'],
            dest: '<%=config.build%>'
          },
          {
            expand: true,
            flatten: false,
            cwd: '<%=config.css%>/',
            src: ['**/*.css'],
            dest: '<%=config.build%>/css/'
          },
          {
            expand: true,
            flatten: false,
            cwd: '<%=config.html%>/',
            src: ['**/*.html'],
            dest: '<%=config.build%>/'
          }
        ]
      }
    },

    watch: {
      files: ['<%=config.js%>/**/*',
              '<%=config.assets%>/**/*',
              '<%=config.css%>/**/*',
              '<%=config.html%>/**/*'],
      tasks: ['no-serving'],
    },

    jshint: {
      game_src: {
        src: ['js/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
      options: {
        jshintrc: true
      }
    },

    concurrent: {
        serveAndWatch: {
          tasks: ['serve', 'watch'],
          options: {
              logConcurrentOutput: true
          }
        }
    },

    /* Setup test framework Mocha */
    mocha: {
      test: {
        src: ['test/**/*.html'],
        options: {
          log: true,
          logErrors: true,
          reporter: 'Spec' // Use 'Nyan' if you want to smile :)
        },
      },
    }

  });

  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('serving', ['concurrent:serveAndWatch']);
  grunt.registerTask('no-serving', ['concat', 'copy:dist']);
  grunt.registerTask('default', ['no-serving', 'serving']);
  grunt.registerTask('spec', ['no-serving', 'mocha']);

};
