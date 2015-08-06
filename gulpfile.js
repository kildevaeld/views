/* jshint esnext:true, node:true */
'use strict';

const gulp = require('gulp'),
      tsc = require('gulp-typescript'),
      wrap = require('gulp-wrap-umd'),
      merge = require('merge2'),
      del = require('del'),
      webpack = require('gulp-webpack'),
      uglify = require('gulp-uglify'),
      rename = require('gulp-rename'),
      jasmine = require('gulp-jasmine-phantom');


gulp.task('build', function () {

  let result = gulp.src('./src/**/*.ts')
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
    devtool: "source-map",
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    module: {
        loaders: [
            
            /*{ 
              test: /\.js$/, 
              loader: 'babel',
              query: {
                optional: ['runtime'],
                loose: ['es6.classes']
              } 
            }*/
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

gulp.task('uglify', ['build:bower'], function () {
  return gulp.src('./dist/views.js')
  .pipe(uglify())
  .pipe(rename('views.min.js'))
  .pipe(gulp.dest('dist'));

});



gulp.task('watch', ['build:bower'],function () {
  gulp.watch('./src/**/*.ts', ['build:bower']);
});

gulp.task('clean', function (done) {
  del(['./lib','./dist', './docs'], done);
});


gulp.task('test', ['build'], function () {
  return gulp.src('./spec/*.js')
  .pipe(jasmine({
    integration: false
  }))
})

gulp.task('docs', function (done) {
  let exec = require('child_process').exec
 
  exec('./node_modules/.bin/tsc --outDir ./tmp', function (err) {
    if (err) return done(err)
    
    exec('./node_modules/.bin/jsdoc -R README.md -r -d ./docs tmp/*.js', function (err) {
      exec('rm -r tmp', done)
    })
    
  })
})

gulp.task('test:integration', ['build:bower'], function () {
  return gulp.src('./spec/integration/*.js')
  .pipe(jasmine({
    integration: true,
    keepRunner: './',
    vendor: [
      './dist/views.js',
      './node_modules/jquery/dist/jquery.js',
      './node_modules/jasmine-jquery/lib/jasmine-jquery.js' 
     ]
  }))
})

gulp.task('default', ['clean','build', 'build:bower', 'definition', 'test','test:integration', 'docs']);