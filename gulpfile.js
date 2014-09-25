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
        .pipe(rename('/js/all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Upload to rackspace
gulp.task('deploy', function() {
    gulp.src(['./dist/all.min.js'], {read: false})
    .pipe(cloudfiles(rackspace, { uploadPath: "/js/" }));

    gulp.src(['css/*.css'], {read: false})
    .pipe(cloudfiles(rackspace, { uploadPath: "/css/" }));
    gulp.src(['tmpl/*.html'], {read: false})
    .pipe(cloudfiles(rackspace, { uploadPath: "/tmpl/" }));
    gulp.src(['img/*.png'], {read: false})
    .pipe(cloudfiles(rackspace, { uploadPath: "/img/" }));
    gulp.src(['index.html'], {read: false})
    .pipe(cloudfiles(rackspace, {}));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(["js/*.js", "js/*/*.js"], ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'deploy', 'watch']);