'use strict';

const gulp = require('gulp'),
			$ = require('gulp-load-plugins')(),
      merge = require('merge2');


const project = $.typescript.createProject('./tsconfig.json', {
    typescript: require('typescript')
});

gulp.task('build', function () {

  /*let result = gulp.src('./src/*ts')
  .pipe($.typescript({
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
    declarationFiles: true,
    typescript: require('typescript')
  }));*/
  
  let result = project.src()
  .pipe($.typescript(project));

  let js = result.js
  .pipe(gulp.dest('./lib'));

  let dts = result.dts.pipe(gulp.dest('./lib'));

  return merge([js,dts]);

});

gulp.task('build:bower', ['build'], function () {
  return gulp.src('./lib/index.js')
  .pipe($.webpack({
    devtool: "source-map",
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    output: {
      library: "views",
      libraryTarget: "umd",
      filename: 'views.js'
    }
  }))
  .pipe(gulp.dest('./dist'));
});

