module.exports = function(grunt) {

  grunt.initConfig({

    buildPath: "build/",

    serve: {
      options: {
        port: 9000
      }
    },

    concat: {
      /* Concats all the .js files under /js into nsn.js */
      js: {
        src: ['js/**/*.js', '!js/main.js'],
        dest: '<%=buildPath%>/js/nsn.js'
      },
    },

    copy: {
      dist: {
        files: [

          /* Main js file which must be loaded first */
          {
            expand: true,
            flatten: true,
            cwd: 'js/',
            src: ['main.js'],
            dest: '<%=buildPath%>/js/'
          },

          /* Bower dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.js'],
            dest: '<%=buildPath%>/js/lib'
          },

          /* Bower's CSS dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*min.css'],
            dest: '<%=buildPath%>/css/lib'
          },
          /* Bower's image dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.png', '**/*.gif'],
            dest: '<%=buildPath%>/img/lib'
          },

          /* Project's assets */
          {
            expand: true,
            flatten: false,
            cwd: 'assets/',
            src: ['**/*'],
            dest: '<%=buildPath%>'
          },
          {
            expand: true,
            flatten: false,
            cwd: 'css/',
            src: ['**/*.css'],
            dest: '<%=buildPath%>/css/'
          },
          {
            expand: true,
            flatten: false,
            cwd: 'html/',
            src: ['**/*.html'],
            dest: '<%=buildPath%>/'
          }
        ]
      }
    },

    watch: {
      files: ['js/**/*',
              'assets/**/*',
              'css/**/*',
              'html/**/*'],
      tasks: ['no-serving'],
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
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('serving', ['concurrent:serveAndWatch']);
  grunt.registerTask('no-serving', ['concat', 'copy:dist']);
  grunt.registerTask('default', ['no-serving', 'serving']);
  grunt.registerTask('spec', ['no-serving', 'mocha']);

};
