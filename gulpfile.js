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

// Clean task ----------------------------
// Deletes the /public directory
// ---------------------------------------

gulp.task('clean', () => {
  return del('export_elements/static/export_elements')
})

// Styles build task ---------------------
// Compiles CSS from Sass
// Output both a minified and non-minified version into /public/stylesheets/
// ---------------------------------------

gulp.task('styles', () => {
  return gulp.src('node_modules/govuk-elements/assets/sass/**/*.scss')
    .pipe(sass({
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets',
      ],
      importer: require('./sass-importer.js'),
    }).on('error', sass.logError))
    .pipe(gulp.dest('export_elements/static/export_elements/stylesheets'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(gulp.dest('export_elements/static/export_elements/stylesheets'))
})

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
  return gulp.watch('./export_elements/**/*.scss', ['styles'])
})

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

  gutil.log(green('----------'))
})
