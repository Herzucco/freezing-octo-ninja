var gulp          = require('gulp');
    browserify    = require('gulp-browserify'),
    rename        = require('gulp-rename'),
    exec          = require('gulp-exec');

var main = 'main.js';
var game = 'game.js';

gulp.task('browserify', function(){
    gulp.src('./src/'+main)
        .pipe(browserify())
        .pipe(rename(game))
        .pipe(gulp.dest('./dist'));
});

gulp.task('desktopify', function(){
    gulp.src('./dist/'+game)
        .pipe(exec('npm start'));
});

gulp.task('default', ['watch', 'browserify']);

gulp.task('watch', function(){
    gulp.watch('./src/**/*.*', ['browserify'])
});