const grunt = require('grunt');
const pkg = require('./package.json');
const config = require('./plugin-config.json');
const loadGruntTasks = require('load-grunt-tasks');
const { default: path } = require('path');

// Define files to include/exclude in the release package
const distFiles = [
    '**',
    '!artworks/**',
    '!artifacts/**',
    '!bin/**',
    '!bower_components/**',
    '!release/**',
    '!node_modules/**',
    '!packages/**',
    '!**/node_modules/**',
    '!vendor/bin/**',
    '!test-results/**',
    '!.DS_Store',
    '!.editorconfig',
    '!.gitignore',
    '!.jshintrc',
    '!.env',
    '!bower.json',
    '!composer.json',
    '!plugin-config.json',
    '!composer.lock',
    '!contributing.md',
    '!docs/**',
    '!documentation/**',
    '!gruntfile.cjs',
    '!package.json',
    '!package-lock.json',
    '!readme.md',
    '!phpcs.xml.dist',
    '!phpunit.xml.dist',
    '!phpstan.neon.dist',
    '!webpack.config.js',
    '!**/*~',
    '!tests/**',
    '!**/test',
    '!.github/**',
    '!**/.github/**',
    '!**/.git/**',
    '!**/.gitattributes',
    '!**/.gitkeep',
    '!.storybook/**',
    '!vite.config.js',
    '!tsconfig.json',
    '!tailwind.config.js',
    '!npm/**',
    '!yarn.lock',
    '!postcss.config.js',
    '!components.json',
    '!js/dist/assets/**/*.js.map',
    '!assets/admin/dist/**/*.js.map',
];

// Replace functionality
var replace = require('replace')
    , _ = grunt.util._
    , log = grunt.log;

// Initialize Grunt configuration
grunt.initConfig({
    pkg,

    checktextdomain: {
        options: {
          text_domain: config.text_domain,
          correct_domain: true,
          keywords: [
            "__:1,2d",
            "_e:1,2d",
            "_x:1,2c,3d",
            "esc_html__:1,2d",
            "esc_html_e:1,2d",
            "esc_html_x:1,2c,3d",
            "esc_attr__:1,2d",
            "esc_attr_e:1,2d",
            "esc_attr_x:1,2c,3d",
            "_ex:1,2c,3d",
            "_n:1,2,4d",
            "_nx:1,2,4c,5d",
            "_n_noop:1,2,3d",
            "_nx_noop:1,2,3c,4d",
            "wp_set_script_translations:1,2d",
            "load_plugin_textdomain:1d,2,3",
            ],
        },
        files: {
            src: [
              "includes/**/*.php",
              "includes/function.php",
              "views/*.php",
              config.plugin_file_name,
              "uninstall.php",
              "plugin.php",
            ],
            expand: true,
          },
    },

    // Task to copy files to the release directory
    copy: {
        main: {
            expand: true,
            src: distFiles,
            dest: 'release/catcher24-connector',
        },
    },

     // Task to delete .js.map files
    clean: {
        mapFiles: ['release/catcher24-connector/js/dist/assets/**/*.js.map']
    },

    // Task to compress the release directory into a zip file
    compress: {
        main: {
            options: {
                mode: 'zip',
                archive: `./release/catcher24-connector.zip`,
            },
            expand: true,
            src: distFiles,
            dest: '/catcher24-connector',
        },
        version: {
            options: {
                mode: 'zip',
                archive: `./release/catcher24-connector-${pkg.version}.zip`,
            },
            expand: true,
            src: distFiles,
            dest: '/catcher24-connector',
        },
        todocs: {
            options: {
                mode: 'zip',
                archive: `./documentation/public/plugin/catcher24-connector.zip`,
            },
            expand: true,
            src: distFiles,
            dest: '/catcher24-connector',
        },
    },
});

// Load all grunt tasks automatically
loadGruntTasks(grunt);

// Register 'release' task to copy files and create a zip archive
grunt.registerTask('release', ['copy:main', 'compress:main', 'compress:version', 'compress:todocs', 'clean:mapFiles']);

grunt.registerTask('change-text-domain', ['checktextdomain']);
// Set linefeed style to Unix (LF)
grunt.util.linefeed = '\n';

module.exports = grunt;
