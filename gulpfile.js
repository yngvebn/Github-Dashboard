var gulp          = require('gulp'),
    gulpif        = require('gulp-if'),
    concat        = require('gulp-concat'),
    rimraf        = require('gulp-rimraf'),
    templateCache = require('gulp-angular-templatecache'),
    minifyHtml    = require('gulp-minify-html'),
    es            = require('event-stream'),
    sass          = require('gulp-sass'),
    jshint        = require('gulp-jshint'),
    rename        = require('gulp-rename'),
    notify        = require('gulp-notify'),
    ngAnnotate    = require('gulp-ng-annotate'),
    uglify        = require('gulp-uglify'),
    wrap          = require('gulp-wrap'),
    minifyCSS     = require('gulp-minify-css'),
    webserver     = require('gulp-webserver'),
    autoprefixer  = require('gulp-autoprefixer'),
    pushalot      = require('pushalot-node'),
    util          = require('gulp-util'),
    spawn         = require('child_process').spawn,
    bowerFiles    = require('main-bower-files'),
    argv          = require('yargs').argv,
    bump          = require('gulp-bump'),
    pck           = require('./package.json'),
    karma         = require('gulp-karma'),
    webdriver_standalone = require('gulp-protractor').webdriver_standalone,
    protractor = require("gulp-protractor").protractor;






var paths = {
  appJavascript:    ['dev/app/**/*.module.js', 'dev/app/**/*.js', '!dev/app/**/*.spec.js', '!dev/app/**/*.specs.js','!dev/app/**/*.e2e.js'],
  specsJavascript:  [
                      'jasmine/github_data.js',
                      'tmp/js/vendor.js',
                      'bower_components/angular-mocks/angular-mocks.js',
                      'tmp/js/app.js',
                      'dev/app/**/*.spec.js',
                      'dev/app/**/*.specs.js'
                    ],
  e2eJavascript:    'dev/app/**/*.e2e.js',
  appTemplates:     'dev/app/**/*.tpl.html',
  appMainSass:      'dev/styles/main.scss',
  ngMaterialThemeFiles: 'bower_components/angular-material/themes/*.css',
  appStyles:        'dev/styles/**/*.scss',
  appImages:        'dev/images/**/*',
  indexHtml:        'dev/index.html',
  bower:            ['./bower_components/**', './bower.json'],
  vendorJavascript: ['dev/vendor/js/angular.js', 'dev/vendor/js/*.js', 'dev/vendor/js/plugins/*.js'],
  vendorCssDir:     'dev/vendor/css/',
  vendorCss:        ['dev/vendor/css/**/*.css'],
  vendorScss:        ['dev/vendor/css/**/*.scss'],
  specFolder:       ['spec/**/*_spec.js'],
  tmpFolder:        'tmp',
  tmpJavascript:    'tmp/js',
  tmpCss:           'tmp/css',
  tmpImages:        'tmp/images',
  distFolder:       'dist',
  distJavascript:   'dist/js',
  distCss:          'dist/css',
  distImages:       'dist/images'
};
argv.protractor = !(!argv.protractor);
argv.production = !(!argv.production);

var runWebServer = function(){
  return !argv.production;
}



gulp.task('test', function(done) {
  return gulp.src(paths.specsJavascript)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch'
    }, done))
    .on('error', handleError);
});

gulp.task('scripts', function() {
  return gulp.src(paths.appJavascript.concat(paths.appTemplates))
    .pipe(gulpif(/html$/, buildTemplates()))
    .pipe(concat('app.js'))
    .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
    .pipe(ngAnnotate())
    .pipe(gulpif(argv.production, uglify()))
    .pipe(gulpif(argv.production, gulp.dest(paths.distJavascript), gulp.dest(paths.tmpJavascript)));
});

gulp.task('vendor', function() {
  return gulp.src(bowerFiles().concat(paths.vendorCss).concat(paths.vendorJavascript))
    .pipe(gulpif(/.js$/, buildVendorScripts()))
    .pipe(gulpif(/css$/, buildVendorCss()));
});

gulp.task('ngMaterialThemes', function(){
  return gulp.src(paths.ngMaterialThemeFiles)
    .pipe(gulp.dest(paths.vendorCssDir));
})


function buildVendorScripts() {
  return es.pipeline(
    concat('vendor.js'),
    gulpif(argv.production, ngAnnotate()),
    gulpif(argv.production, uglify()),
    gulpif(argv.production, gulp.dest(paths.distJavascript), gulp.dest(paths.tmpJavascript))
  );
}


function buildVendorCss() {
  return es.pipeline(
    sass().on('error', handleError),
    autoprefixer({ browsers: ['last 2 versions', 'ie 9'], cascade: false }),
    concat('vendor.css'),
    gulpif(argv.production, minifyCSS({ keepSpecialComments : 0 })),
    gulpif(argv.production, gulp.dest(paths.distCss), gulp.dest(paths.tmpCss))
    );
}


gulp.task('styles', function() {
  return gulp.src(paths.appStyles)
    .pipe(gulpif(/scss$/, sass().on('error', handleError)))
    .pipe(autoprefixer({ browsers: ['last 2 versions', 'ie 9'], cascade: false }))
    .pipe(concat('app.css'))
    .pipe(gulpif(argv.production, minifyCSS()))
    .pipe(gulpif(argv.production, gulp.dest(paths.distCss), gulp.dest(paths.tmpCss)));
});

gulp.task('images', function() {
  return gulp.src(paths.appImages)
    .pipe(gulpif(argv.production, gulp.dest(paths.distImages), gulp.dest(paths.tmpImages)));
});

gulp.task('indexHtml', function() {
  return gulp.src(paths.indexHtml)
    .pipe(gulpif(argv.production, gulp.dest(paths.distFolder), gulp.dest(paths.tmpFolder)));
});

gulp.task('lint', function() {
  return gulp.src(paths.appJavascript.concat(paths.specFolder))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function() {
  return gulp.src([paths.tmpFolder, paths.distFolder], {read: false})
    .pipe(rimraf());
});

gulp.task('build', ['vendor','lint', 'scripts', 'styles','images', 'indexHtml', /*'ngMaterialThemes'*/]);

gulp.task('watch', ['build', 'webserver'], function() {
  gulp.watch(paths.appJavascript, ['lint', 'scripts', 'test']);
  gulp.watch(paths.appTemplates, ['scripts']);
  gulp.watch(paths.specsJavascript, ['test']);
  gulp.watch(paths.vendorJavascript, ['scripts']);
  gulp.watch(paths.appImages, ['images']);
  gulp.watch(paths.specFolder, ['lint']);
  gulp.watch(paths.indexHtml, ['indexHtml']);
  gulp.watch(paths.appStyles, ['styles']);
  gulp.watch(paths.bower, ['vendor', 'test']);
});


gulp.task('notify', function(){
  var client = new pushalot( "ad495e394a554d749563c7280ecfa985" )
  console.log('Pushing message to pushalot');
  client.push('Timer is deployed to Azure!', 'Deployment')
  .on('success', function ( code , res ) {
    console.error(code, res);
  })
  .on('error', function (code , res ) {
    console.log(code, res);
  })
});

gulp.task('webserver', ['vendor', 'scripts', 'styles', /*'images',*/ 'indexHtml'], function() {
  gulp.src(paths.tmpFolder)
    .pipe(gulpif(function(){ return !argv.production; }, webserver({
      port: 3333,
      livereload: true,
      fallback: 'index.html'
    })));
});

gulp.task('default', ['watch']);

function handleError(err){
  util.log(err.message);
  this.emit('end');
}

function buildTemplates() {
  return es.pipeline(
    minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }),
    templateCache({
      module: 'Templates'
    })
  );
}