
var gulp = require('gulp');
var rename = require('gulp-rename'); //重命名
var cssnano = require('gulp-cssnano'); // css的层级压缩合并
var sass = require('gulp-sass'); //sass
var jshint = require('gulp-jshint'); //js检查 ==> npm install --save-dev jshint gulp-jshint（.jshintrc：https://my.oschina.net/wjj328938669/blog/637433?p=1）  
var uglify = require('gulp-uglify'); //js压缩  
var concat = require('gulp-concat'); //合并文件  
var imagemin = require('gulp-imagemin'); //图片压缩 
var Config = require('./gulp.config.js');
var rimraf = require('rimraf');
const babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
//======= gulp build 打包资源 ===============
function prod() {
    /**
     * 清除dist
     */
    gulp.task('cleanDist',function(cb){
        rimraf('./dist', cb);
    });
    /** 
     * HTML处理 
     */
    gulp.task('html', function () {
        return gulp.src(Config.html.src).pipe(htmlmin({collapseWhitespace: true})).pipe(gulp.dest(Config.html.dist));
    });
    /** 
     * assets文件夹下的所有文件处理 
     */
    gulp.task('assets', function () {
        return gulp.src(Config.assets.src).pipe(gulp.dest(Config.assets.dist));
    });
    /** 
     * CSS样式处理 
     */
    gulp.task('css', function () {
        return gulp.src(Config.css.src).pipe(postcss([ autoprefixer() ])).pipe(gulp.dest(Config.css.dist)).pipe(rename({
                suffix: '.min'
            })).pipe(cssnano()) //执行压缩
            .pipe(gulp.dest(Config.css.dist));
    });
    /** 
     * SASS样式处理 
     */
    gulp.task('sass', function () {
        return gulp.src(Config.sass.src).pipe(sass()).pipe(postcss([ autoprefixer()])).pipe(gulp.dest(Config.sass.dist)).pipe(rename({
                suffix: '.min'
            })) //rename压缩后的文件名
            .pipe(cssnano()) //执行压缩
            .pipe(gulp.dest(Config.sass.dist));
    });
    /** 
     * js处理 
     */
    gulp.task('js', function () {
        return gulp.src(Config.js.src).pipe(babel({
            presets: ['env']
        })).pipe(jshint('.jshintrc')).pipe(jshint.reporter('default')).pipe(gulp.dest(Config.js.dist)).pipe(rename({
            suffix: '.min'
        })).pipe(uglify()).pipe(gulp.dest(Config.js.dist));
    });
    /** 
     * 合并所有js文件并做压缩处理 
     */
    gulp.task('js-concat', function () {
        return gulp.src(Config.js.src).pipe(jshint('.jshintrc')).pipe(jshint.reporter('default')).pipe(concat(Config.js.build_name)).pipe(gulp.dest(Config.js.dist)).pipe(rename({
            suffix: '.min'
        })).pipe(uglify()).pipe(gulp.dest(Config.js.dist));
    });
    /** 
     * 图片处理 
     */
    gulp.task('images', function () {
        return gulp.src(Config.img.src).pipe(imagemin({
            optimizationLevel: 3
            , progressive: true
            , interlaced: true
        })).pipe(gulp.dest(Config.img.dist));
    });
    gulp.task('build', ['cleanDist', 'html', 'css', 'sass', 'js', 'assets', 'images']);
}
module.exports = prod;