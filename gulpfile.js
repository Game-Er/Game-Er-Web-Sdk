var gulp = require('gulp'),
    typescript  = require('gulp-typescript'),
    tsd = require('gulp-tsd'),
    eventStream = require('event-stream'),
    typedoc     = require('gulp-typedoc'),
    deploy      = require('gulp-gh-pages');

var project = typescript.createProject({
  'removeComments': true,
  'noImplicitAny': true,
  'noLib': false,
  'noEmitOnError': true,
  'target': 'ES5',
//  'module': 'amd',
//  'sourceRoot': '',
  'declarationFiles': true,
  'noExternalResolve': false,
  'sortOutput': true
});

gulp.task('tsd', function (callback) {
  tsd({
    command: 'reinstall',
    latest: true,
    config: './tsd.json'
  }, callback);
});

gulp.task('compile', function() {
  var output = gulp
      .src('lib/*.ts')
      .pipe(typescript(project));

  return eventStream.merge(
      output.dts.pipe(gulp.dest('build/definitions')),
      output.js.pipe(gulp.dest('build/js')));
});

gulp.task('typedoc', function() {
  return gulp
      .src('lib/*.ts')
      .pipe(typedoc({
        name: 'GameUp SDK',
        module: 'commonjs',
        out: './build/docs',
        target: 'es5',
        theme: 'minimal'
      }));
});

gulp.task('deploy', ['typedoc'], function () {
  return gulp.src('./build/docs/**/*')
    .pipe(deploy());
});

gulp.task('watch', ['compile'], function() {
  gulp.watch('lib/*.ts', ['compile']);
});

gulp.task('default', ['watch'], function() {
});
