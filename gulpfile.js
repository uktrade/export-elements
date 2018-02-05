'use strict'

const paths = require('govuk-elements/config/paths.json')
const gulp = require('gulp')
const gutil = require('gulp-util')
const cssnano = require('gulp-cssnano')
const del = require('del')
const mocha = require('gulp-mocha')
const nodemon = require('gulp-nodemon')
const rename = require('gulp-rename')
const runsequence = require('run-sequence')
const sass = require('gulp-sass')
const sassLint = require('gulp-sass-lint');

// Sass lint -----------------------------

gulp.task('lint:sass', function () {
  return gulp.src('export_elements/**/*.scss')
    .pipe(sassLint({
      options: {
        formatter: 'stylish',
        'merge-default-rules': true
      },
      configFile: 'sass-lint-config.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});


// Run tests -----------------------------

gulp.task('test', () => {
  runsequence(['lint:sass'], cb => {
    if (cb) {
      gutil.log(gutil.colors.red('!!!!!!!! Tests failed !!!!!!!!'));
    } else {
      gutil.log(gutil.colors.green('**** Tests finished with no errors ****'));
    }
  });
});

// Clean task ----------------------------
// Deletes the /public directory
// ---------------------------------------

gulp.task('clean', () => {
  return del('export_elements/static/export_elements')
})

// GovUK styles build task ---------------
// Compiles CSS from Sass
// Output both a minified and non-minified version into /public/stylesheets/
// ---------------------------------------

gulp.task('styles:govuk', () => {
  return gulp.src('node_modules/govuk-elements/assets/sass/**/*.scss')
    .pipe(sass({
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets'
      ],
      importer: require('./sass-importer.js')
    }).on('error', sass.logError))
    .pipe(gulp.dest('export_elements/static/export_elements/stylesheets'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('export_elements/static/export_elements/stylesheets'));
});

// Export-elements-specific component styling

gulp.task('styles:components', () => {
  return gulp.src('export_elements/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('export_elements/static/export_elements/stylesheets'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('export_elements/static/export_elements/stylesheets'));
});

// Compile all styles

gulp.task('styles', ['styles:govuk', 'styles:components']);

// Images build task ---------------------
// Copies images to /public/images
// ---------------------------------------

gulp.task('images', () => {
  return gulp.src('node_modules/govuk-elements/assets/images/**/*')
    .pipe(gulp.dest('export_elements/static/export_elements/images'))
})

// Scripts build task ---------------------
// Copies JavaScript to /public/javascripts
// ---------------------------------------
gulp.task('scripts', () => {
  return gulp.src('node_modules/govuk-elements/assets/javascripts/**/*.js')
    .pipe(gulp.dest('export_elements/static/export_elements/javascripts'))
})

// Build task ----------------------------
// Runs tasks that copy assets to the public directory.
// ---------------------------------------

gulp.task('build', cb => {
  runsequence('clean', ['styles', 'images', 'scripts'], cb)
})

// Server task --------------------------
// Configures nodemon
// ---------------------------------------
gulp.task('server', () => {
  nodemon({
    watch: ['.env', '**/*.js', '**/*.json'],
    script: 'server.js',
    ignore: [
      paths.public + '*',
      paths.assets + '*',
      paths.nodeModules + '*'
    ]
  })
})

// Watch task ----------------------------
// When a file is changed, re-run the build task.
// ---------------------------------------

gulp.task('watch', () => {
  return gulp.watch('./export_elements/**/*.scss', ['styles']);
});

// Develop task --------------------------
// Runs copy-assets task and sets up watches.
// ---------------------------------------
gulp.task('develop', cb => {
  runsequence('build',
              'watch',
              'server', cb)
})

// Default task --------------------------
// Lists out available tasks.
// ---------------------------------------

gulp.task('default', () => {
  const cyan = gutil.colors.cyan
  const green = gutil.colors.green

  gutil.log(green('----------'))

  gutil.log(('The following main ') + cyan('tasks') + (' are available:'))

  gutil.log(cyan('build'
    ) + ': copies assets to the public directory.'
  )
  gutil.log(cyan('develop'
    ) + ': performs an initial build then sets up watches.'
  )
  gutil.log(cyan('test'
) + ': runs tests/lint.'
  )

  gutil.log(green('----------'))
})
