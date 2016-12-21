'use strict';

const gulp = require('gulp'),
			$ = require('gulp-load-plugins')(),
      merge = require('merge2'),
      replace = require('gulp-replace');


const pkgjson = require(process.cwd() + '/package.json')

const project = $.typescript.createProject('./tsconfig.json', {
    typescript: require('typescript')
});

gulp.task('build', function () {

  
  let result = project.src()
  .pipe($.typescript(project));
  
  let js = result.js
  .pipe(replace('$VERISON$', pkgjson.version))
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
    },
    externals: {
      orange: "orange",
      'orange.dom': {
        root: ['orange', 'dom'],
        commonjs: 'orange.dom',
        amd: 'orange.dom'
      },
      eventsjs: "eventsjs"
    }
  }))
  .pipe(gulp.dest('./dist'));
});

gulp.task('build:amd', ['build'], function () {

  const project = $.typescript.createProject('./tsconfig.json', {
    typescript: require('typescript'),
    declaration: false,
    module: 'amd',
    target: 'es5'
  });

  let result = project.src()
  .pipe($.typescript(project));
  
  return result.js
  .pipe(replace('$VERISON$', pkgjson.version))
  .pipe(gulp.dest('./dist/amd'));
});

gulp.task('build:bundle', ['build'], () => {

    return gulp.src('./lib/index.js')
  .pipe($.webpack({
    devtool: "source-map",
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    output: {
      library: "views",
      libraryTarget: "umd",
      filename: 'views.bundle.js'
    }
  }))
  .pipe(gulp.dest('./dist'));



});
