var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var jshint = require('gulp-jshint');
var gulpCopy = require('gulp-copy');
var del = require('del');



gulp.task('less', function () {
    return gulp.src('src/styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('dest/styles'))
        .pipe(browserSync.stream())
});

gulp.task('jshint', function () {
    gulp.src(['*.js', 'public/js/**/*.js']).pipe(jshint());
});

gulp.task('concat', function() {
    return gulp.src('src/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dest/js'))
});

gulp.task('compress', function () {
   return gulp.src('dest/js/all.js')
       .pipe(uglify())
       .pipe(rename({ suffix: '.min' }))
       .pipe(gulp.dest('dest/js'))
       .pipe(browserSync.stream())
});

gulp.task('server', ['less', 'concat', 'compress'], function () {
    browserSync.init({
        server: './'
    });

    gulp.watch('src/styles/*.less', ['less'])
    gulp.watch('src/js/*.js', ['concat', 'compress'])
    gulp.watch('*.html').on('change', browserSync.reload)
});


gulp.task('prod', function () {
    del.sync('./prod/');
    
    return gulp
        .src(['./index.html', './dest/js/all.min.js', './dest/styles/*.css'])
        .pipe(gulpCopy('./prod/', {prefix: 1}));
});


gulp.task('del', function () {
    return del.sync('./prod/');
});

