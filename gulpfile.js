var gulp            = require('gulp');
var gutil           = require('gulp-util');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var del             = require('del');
var shell           = require('gulp-shell');
var run             = require('gulp-run');
var rsync           = require('gulp-rsync');

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
var DIST_PATH           = 'public';
var DIST_FILES          = 'public/**';

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


gulp.task('clean', function() {
    return del.sync([
        DIST_PATH
    ]);
});

gulp.task('deploy', ['clean', 'hugo-build'], function() {
    var taskLine = 'rsync -arvz -e \'ssh -p 44444\' --progress --delete public/ ski081@66.175.214.108:/var/www/markstruzinski.com/public_html';
    return run(taskLine).exec()
        .pipe(gulp.dest('output'));
});

gulp.task('hugo-build', shell.task(['hugo']));

gulp.task('default', ['watch']);
