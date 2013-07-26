var fs = require('fs');
var livereload = require('connect-livereload');
var connect = require('connect');


module.exports = function(grunt) {

  grunt.initConfig({

    requirejs: {
      compile: {
        options: {
          name: '../lib/almond',
          include: 'config',
          out: 'litewrite.js',
          baseUrl: 'src',
          keepBuildDir: true,
          inlineText: true,
          wrap: true,
          insertRequire: ['config'],
          mainConfigFile: 'src/config.js',
          stubModules: [
            'text'
          ]
        }
      }
    },

    clean: {
      build: [
        'Gruntfile.js',
        'src',
        'lib'
      ]
    },

   connect: {
      server: {
        options: {
          middleware: function(connect, options) {
            return [
              livereload(),
              connect.static(options.base),
              connect.directory(options.base)
            ];
          }
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      files: ['*', '*/*']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');


  grunt.registerTask('replaceRequireHtml', 'include litewrite.js in index.html instead of lib/require.', function () {
    var input = fs.readFileSync('index.html', { encoding: 'utf8' });
    var output = input.replace('lib/require.js" data-main="src/config', 'litewrite.js');
    fs.writeFileSync('index.html', output);
  });


  grunt.registerTask('build', ['requirejs', 'replaceRequireHtml', 'clean']);
  grunt.registerTask('default', ['connect', 'watch']);

};
