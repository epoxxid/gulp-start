const gulp        = require('gulp');
const path        = require('path');
const util        = require('gulp-util');
const uglify      = require('gulp-uglify');
const browserify  = require('browserify');
const source      = require('vinyl-source-stream');
const buffer      = require('vinyl-buffer');
const sourcemaps  = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const sass        = require('gulp-sass');
const rename      = require('gulp-rename');

// BrowserSync will use this dir as server root
const serverRoot = path.resolve(__dirname, 'dist');

// Javascript configuration
const js = {
	srcDir: path.resolve(__dirname, 'src/js'),
	entryPoint: path.resolve(__dirname, 'src/js/index.js'),
	outputDir: serverRoot + '/js',
	outputFile: 'bundle.js'
};
js.watchFiles = js.srcDir + '/**/*.js';

// Styles configuration
const styles = {
	srcDir: path.resolve(__dirname, 'src/scss'),
	sassEntryPoint: path.resolve(__dirname, 'src/scss/styles.scss'),
	outputDir: serverRoot + '/css',
	outputName: 'styles.css'
};
styles.watchFiles = styles.srcDir + '/**/*.scss';

function compileJs(cb) {
	browserify({entries: js.entryPoint, debug: true}) // Resolve dependencies
		.transform('babelify', {presets: ['env']})    // Process with babel
		.bundle()                                     // Save file
		.pipe(source(js.outputFile))                  // Create vinyl file
		.pipe(buffer())                               // Load vinyl file as gulp buffer
		.pipe(sourcemaps.init())                      // Init source maps
		.pipe(uglify())                               // Compress
		.pipe(sourcemaps.write('.'))                  // Save source maps
		.pipe(gulp.dest(js.outputDir))                // Save file
		.pipe(browserSync.stream())                   // Stream into browser
		.on('error', util.log);                       // Log error
	cb();
}

function compileStyles(cb) {
	gulp.src(styles.sassEntryPoint)
		.pipe(sass())
		.pipe(rename(styles.outputName))
		.pipe(gulp.dest(styles.outputDir))
		.pipe(browserSync.stream())
		.on('error', util.log);
	cb();
}


function watch(cb) {
	// Init live reload
	browserSync.init({server: serverRoot});
	gulp.watch(js.watchFiles, compileJs)
	gulp.watch(styles.watchFiles, compileStyles);
	gulp.watch(serverRoot + '/*.html', browserSync.reload);
	cb();
}

const compile = gulp.parallel(compileJs, compileStyles);

module.exports = {
	build: compile,
	watch: gulp.series(compile, watch)
};