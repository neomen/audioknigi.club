var gulp     = require('gulp');
var clean    = require('gulp-clean');
var es       = require('event-stream');
var rseq     = require('gulp-run-sequence');
var zip      = require('gulp-zip');
var shell    = require('gulp-shell');
var chrome   = require('./vendor/chrome/manifest');

var fs 			 = require('fs');

function pipe(src, transforms, dest) {
	if (typeof transforms === 'string') {
		dest = transforms;
		transforms = null;
	}

	var stream = gulp.src(src);
	transforms && transforms.forEach(function(transform) {
		stream = stream.pipe(transform);
	});

	if (dest) {
		stream = stream.pipe(gulp.dest(dest));
	}

	return stream;
}

gulp.task('clean', function() {
	return pipe('./build', [clean()]);
});

gulp.task('chrome', function() {
	return es.merge(
		pipe('./bower_components/jquery/dist/jquery.min.js', './build/chrome/libs/'),
		pipe('./libs/**/*', './build/chrome/libs'),
		pipe('./img/**/*', './build/chrome/img'),
		pipe('./js/**/*', './build/chrome/js'),
		pipe('./css/**/*', './build/chrome/css'),
		pipe('./vendor/chrome/background.js', './build/chrome/'),
		pipe('./vendor/chrome/manifest.json', './build/chrome/')
	);
});

gulp.task('chrome-dist', function () {
	// gulp.src('./build/chrome/**/*')
	gulp.src('./build/chrome/')
		.pipe(zip('chrome-extension-' + chrome.version + '.zip'))
		.pipe(gulp.dest('./dist/chrome'));
});


gulp.task('dist', function(cb) {
	return rseq('clean', ['chrome'], ['chrome-dist'], cb);
});

gulp.task('watch', function() {
	gulp.watch(['./js/**/*', './css/**/*', './vendor/**/*', './img/**/*'], ['default']);
});

gulp.task('build', function(cb) {
	return rseq('clean', ['chrome'], cb);
});

gulp.task('default', function(cb) {
	return rseq('clean', ['chrome'], cb);
});
