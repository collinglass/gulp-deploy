// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var amdOptimize = require("amd-optimize");
var fs = require('fs')
var cloudfiles = require("gulp-cloudfiles");
var rackspace = JSON.parse(fs.readFileSync('./rackspace.json'));

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(["js/*.js", "js/*/*.js"])
        .pipe(amdOptimize("js/main", {
          configFile : "js/config.js"
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(["js/*.js", "js/*/*.js"], ['lint', 'scripts']);
});

// 
var options = { 
    delay: 1000, // optional delay each request by x milliseconds, default is 0
    headers: {}, // optional additional headers
    uploadPath: "" //optional upload path (uses the container root by default)
} 

// Upload to rackspace
gulp.task('deploy', function() {
    gulp.src(['./dist/**', './css/*.css', './tmpl/*.html', './index.html', './img/*.png'], {read: false})
    .pipe(cloudfiles(rackspace, options));
});


// Default Task
gulp.task('default', ['lint', 'scripts', 'watch', 'deploy']);
