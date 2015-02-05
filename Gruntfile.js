module.exports = function(grunt) {

  grunt.initConfig({

    buildPath: "build/",

    serve: {
      options: {
        port: 9000
      }
    },

    concat: {
      /*   Concats all the .js files under /src/js into nsn.js */
      js: {
        src: ['src/js/**/*.js', '!src/js/main.js'],
        dest: '<%=buildPath%>/js/nsn.js'
      },
    },

    copy: {
      dist: {
        files: [

          /*   Main js file which must be loaded first */
          {
            expand: true,
            flatten: true,
            cwd: 'src/js/',
            src: ['main.js'],
            dest: '<%=buildPath%>/js/'
          },

          /*   Bower dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.js'],
            dest: '<%=buildPath%>/js/lib'
          },

          /*   Bower's CSS dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*min.css'],
            dest: '<%=buildPath%>/css/lib'
          },
          /*   Bower's image dependencies */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.png', '**/*.gif'],
            dest: '<%=buildPath%>/img/lib'
          },

          /*   Project's assets */
          {
            expand: true,
            flatten: false,
            cwd: 'src/assets/',
            src: ['**/*'],
            dest: '<%=buildPath%>'
          },
          {
            expand: true,
            flatten: false,
            cwd: 'src/css/',
            src: ['**/*.css'],
            dest: '<%=buildPath%>/css/'
          },
          {
            expand: true,
            flatten: false,
            cwd: 'src/html',
            src: ['**/*.html'],
            dest: '<%=buildPath%>/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat', 'copy:dist', 'serve']);

};
