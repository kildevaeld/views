/* jshint esnext:true, node:true */
'use strict';

const gulp = require('gulp'),
      tsc = require('gulp-typescript'),
      wrap = require('gulp-wrap-umd'),
      merge = require('merge2'),
      del = require('del'),
      webpack = require('gulp-webpack');


gulp.task('build', function () {

  let result = gulp.src('./src/*.ts')
  .pipe(tsc({
    "target": "ES5",
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
    declarationFiles: true
  }));

  let js = result.js
  .pipe(gulp.dest('./lib'));

  let dts = result.dts.pipe(gulp.dest('./lib'));

  return merge([js,dts]);

});

gulp.task('build:bower', ['build'], function () {
  return gulp.src('./lib/index.js')
  .pipe(webpack({
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    },
    output: {
      library: "views",
      libraryTarget: "umd",
      filename: 'views.js'
    }
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('definition', ['build', 'build:bower'], function () {
  return gulp.src('./templates/views.d.ts')
  .pipe(gulp.dest('./'));
});

gulp.task('default', ['build', 'build:bower', 'definition']);

gulp.task('watch', function () {
  gulp.watch('./src/**/*.ts', ['build']);
});

gulp.task('clean', function (done) {
  del(['./lib','./dist'], done);
});
