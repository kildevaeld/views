'use strict';

const gulp = require('gulp'),
			bump = require('gulp-bump')
			
			
gulp.task('bump:patch', function () {
	return gulp.src(['./package.json','bower.json'])
	.pipe(bump());
});

gulp.task('bump:minor', function () {
	return gulp.src(['./package.json','bower.json'])
	.pipe(bump({type:'minor'}));
});