var gulp            = require('gulp');
var gutil           = require('gulp-util');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var hash            = require('gulp-hash');
var del             = require('del');

// Path variables
var SASS_SRC_PATH       = 'src/scss/**/*.scss';
var SASS_DEST_PATH      = 'static/css';
var IMAGES_SRC_PATH     = 'src/images/**/*';
var IMAGES_PATH         = 'static/images/**/*';
var IMAGES_DEST_PATH    = 'static/images';
var JS_SRC_PATH         = 'src/js/**/*';
var JS_PATH             = 'static/js/**/*';
var JS_DEST_PATH        = 'static/js';

// Compile and compress sass files. Deploy to static folder
gulp.task('scss', function() {
    gulp.src(SASS_SRC_PATH)
        .pipe(sass({
            outputstyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 20 versions']
        }))
        .pipe(hash())
        .pipe(gulp.dest(SASS_DEST_PATH));
});

// Hash images
gulp.task('images', function() {
    del([IMAGES_PATH]);
    gulp.src(IMAGES_SRC_PATH)
        .pipe(hash())
        .pipe(gulp.dest(IMAGES_DEST_PATH));
});

// Hash Javascript
gulp.task('js', function() {
    del([JS_PATH]);
    gulp.src(JS_SRC_PATH)
        .pipe(hash())
        .pipe(gulp.dest(JS_DEST_PATH));
});

gulp.task('watch', ['scss', 'images', 'js'], function() {
    gulp.watch(SASS_SRC_PATH, ['scss']);
    gulp.watch(IMAGES_SRC_PATH, ['images']);
    gulp.watch(JS_SRC_PATH, ['js']);
});

gulp.task('default', ['watch']);