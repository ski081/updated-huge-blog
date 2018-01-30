var gulp            = require('gulp');
var gutil           = require('gulp-util');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');

gulp.task('scss', function() {
    gulp.src('src/scss/**/*.scss')
        .pipe(sass({
            outputstyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 20 versions']
        }))
        .pipe(gulp.dest('static/css'));
});

gulp.task('watch', ['scss'], function() {
    gulp.watch('src/scss/**/*', ['scss']);
});

gulp.task('default', ['watch']);