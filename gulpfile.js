var gulp            = require('gulp');
var gutil           = require('gulp-util');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var del             = require('del');

// Path variables
var SASS_SRC_PATH       = 'src/scss/**/*.scss';
var SASS_PATH           = 'static/css/**/*';
var SASS_DEST_PATH      = 'static/css';
var IMAGES_SRC_PATH     = 'src/images/**/*';
var IMAGES_PATH         = 'static/images/**/*';
var IMAGES_DEST_PATH    = 'static/images';
var JS_SRC_PATH         = 'src/js/**/*';
var JS_PATH             = 'static/js/**/*';
var JS_DEST_PATH        = 'static/js';

// Compile and compress sass files. Deploy to static folder
gulp.task('scss', function() {
    del([SASS_PATH]);

    gulp.src(SASS_SRC_PATH)
        .pipe(sass({
            outputstyle: 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 20 versions']
        }))
        .pipe(gulp.dest(SASS_DEST_PATH));
});

gulp.task('watch', ['scss'], function() {
    gulp.watch(SASS_SRC_PATH, ['scss']);
});

gulp.task('default', ['watch']);