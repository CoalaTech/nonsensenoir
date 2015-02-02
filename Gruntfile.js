module.exports = function(grunt) {

  grunt.initConfig({

    buildPath: "build/",

    serve: {
      options: {
        port: 9000
      }
    },

    copy: {
      dist: {
        files: [
          /*   Dependencias do bower */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.js'],
            dest: '<%=buildPath%>/js/lib'
          },

          /*   Css das dependencias do bower */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*min.css'],
            dest: '<%=buildPath%>/css/lib'
          },
          /*   Imagens das dependencias do bower */
          {
            expand: true,
            flatten: true,
            cwd: 'bower_components/',
            src: ['**/*.png', '**/*.gif'],
            dest: '<%=buildPath%>/img/lib'
          },

          /*   Assets do projeto */
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
            cwd: 'src/js/',
            src: ['**/*.js'],
            dest: '<%=buildPath%>/js/'
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

  grunt.registerTask('default', ['copy:dist', 'serve']);
  // grunt.registerTask('server', ['serve']);

};