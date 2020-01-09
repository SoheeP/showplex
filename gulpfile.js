const gulp         = require('gulp');
const sourcemaps   = require('gulp-sourcemaps');
const babel        = require('gulp-babel');
const uglify       = require('gulp-uglify');
const sass         = require('gulp-sass');
sass.compiler      = require('node-sass');
const sassGlob     = require('gulp-sass-glob');
const plumber      = require('gulp-plumber');
const autoprefixer = require('gulp-autoprefixer');
const del          = require('del');
const imagemin     = require('gulp-imagemin');

const assets = {
  src:`./public/src/assets`,
  dist:`./public/dist/assets`,
  clean: `./public/dist/*`
};

const paths = {
  image: {
    src:`${assets.src}/images/**/*`,
    dist:`${assets.dist}/images/`
  },
  style: {
    src:`${assets.src}/scss/**/*.{scss, css}`,
    dist:`${assets.dist}/css`
  },
  js: {
    src:`${assets.src}/js/**/*.js`,
    dist:`${assets.dist}/js`
  }
};

const setting = {
  styles: {
    scss_option: {
      outputStyle: "compressed",
      indentType: "tab",
      indentWidth: 1,
      precision: 3,
      sourceComments: false,
      errLogToConsole: true
    }
  }
};

//Error Handler
function handleError(err){
  console.log(err);
  this.emit('end')
};

var info=()=>{
  console.log(`
  /* 
  ================================================+
  Node version : ${process.version}
  PPID         : ${process.ppid}
  pid          : ${process.pid}
  platform     : ${process.platform}
  ================================================+
  */
  `);
};

  info();

gulp.task('clean', () => del([assets.clean]));

gulp.task('scripts', () => {
  return gulp.src(paths.js.src)
    .pipe(babel().on('error', handleError))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dist))
});

gulp.task('styles', ()=>{
  return gulp.src(paths.style.src)
  .pipe(sourcemaps.init())
  .pipe(sassGlob())
  .pipe(plumber())
  .pipe(sass(setting.styles.scss_option).on('error', sass.logError))
  .pipe(autoprefixer())
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(paths.style.dist))
});

gulp.task('imagemin', ()=>{
  return gulp.src(paths.image.src)
  .pipe(imagemin())
  .pipe(gulp.dest(paths.image.dist))
})

gulp.task('watch', ()=>{
  gulp.watch(paths.style.src, ['styles']);
  gulp.watch(paths.js.src, ['scripts'])
  gulp.watch(paths.image.src, ['imagemin'])
});

/**
 * ==================================+
 * @ gulp tasks process
 * ==================================+
 */
const default_process = ['scripts', 'styles', 'imagemin', 'watch'];
gulp.task('default', default_process, ()=>{
  console.log(`Gulp is running!`);
  info();
})