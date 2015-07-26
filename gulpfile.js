/* jshint esnext:true, node:true */
'use strict';

const gulp = require('gulp'),
      tsc = require('gulp-typescript'),
      wrap = require('gulp-wrap-umd'),
      merge = require('merge2'),
      del = require('del');


gulp.task('build', function () {

  let result = gulp.src('./src/index.ts')
  .pipe(tsc({
    out: 'views.js',
    declarationFiles: true,
    "target": "es5",
    "module": "commonjs",
    "isolatedModules": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "declaration": true,
    "noImplicitAny": false,
    "removeComments": false,
    "noLib": false,
    "preserveConstEnums": true,
    "suppressImplicitAnyIndexErrors": true,
  }));

  let js = result.js
  .pipe(wrap({
      namespace: 'views',
      exports: 'views'
  }))
  .pipe(gulp.dest('./lib'));

  let dts = result.dts.pipe(gulp.dest('./'));

  return merge([js,dts]);

});

gulp.task('default', ['build']);

gulp.task('watch', function () {
  gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('clean', function (done) {
  del(['./tmp'], done);
});
