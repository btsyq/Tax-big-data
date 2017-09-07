/**
 * 常用gulp工具和任务.
 */

//导入gulp
const gulp = require('gulp'),
	path = require('path'),
	//导入工具包
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	config = require('./config'), //文件夹路径配置模块
	rename = require('gulp-rename'), //文件重命名
	plumber = require('gulp-plumber'), //文件合并
	del = require('del'), //文件夹删除清空
	pug = require('gulp-pug'), //pug模板编译
	htmlBeautify = require('gulp-html-beautify'), //html美化
	less = require('gulp-less'), //less编译
	cleanCSS = require('gulp-clean-css'), //压缩css
	babel = require('gulp-babel'), //es6编译
	uglify = require('gulp-uglify'), //js压缩
	imgmin = require('gulp-imagemin'); //图片压缩

/**html**/

//  编译pug
gulp.task('pug', function() {
	return gulp.src(config.html)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		//标签缩进
		.pipe(htmlBeautify({
			indentSize: 1
		}))
		.pipe(gulp.dest(
			path.join(config.dist, 'html')
		));
});

//  监听pug
gulp.task('watch-pug', ['pug'], reload);

/**css**/

//  编译less
gulp.task('less', function() {
	return gulp.src(config.less.all)
		.pipe(plumber())
		//编译less
		.pipe(less())
		//压缩css
		.pipe(autoprefixer({
		    browsers: ['last 5 versions'],
		        cascade: true
		}))
		//.pipe(cleanCSS())
		//重命名
		//.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest(
			path.join(config.dist, 'css')
		))
		.pipe(reload({
			stream: true
		}));
});

//  监听less文件
gulp.task('watch-less', ['less'], reload);

//es6
gulp.task('es6', function() {
	return gulp.src(config.scripts)
		.pipe(plumber())
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(gulp.dest(
			path.join(config.dist, 'js')
		))
})

//监听js文件
gulp.task('watch-js', ['es6'], reload);

/**util**/

//  清空输出文件夹
gulp.task('clean', function() {
	return del(
		path.join(config.dist, '*')
	);
});

//  图片压缩写入输出文件夹
gulp.task('imgmin', function() {
	return gulp.src(config.img)
		.pipe(imgmin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
		}))
		.pipe(gulp.dest(
			path.join(config.dist, 'images')
		));
});

/**
 * 默认任务
 */
gulp.task('default', ['imgmin', 'less', 'es6', 'pug'], function() {
	browserSync({
		server:
			{baseDir: path.join(__dirname, '/')} // 设定项目根目录启动服务

	});
	//  监控less文件
	gulp.watch([config.less.all], ['watch-less']);

	//  监控js文件
	gulp.watch(config.scripts, ['watch-js']);

	//  监控pug文件
	gulp.watch(config.html, ['watch-pug']);

});