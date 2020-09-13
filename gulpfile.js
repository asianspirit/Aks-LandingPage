
"use = strict";

let projectFolder = 'dist'; // папка с готовым результатом
let sourceFolder = 'src'; // папка с исходниками

let fs = require('fs');

// объект содержащий различные пути к файлам и папкам 
let path = {
    build: {
        html: projectFolder + '/',
        css: projectFolder + '/css/',
        js: projectFolder + '/js/',
        img: projectFolder + '/img/',
        fonts: projectFolder + '/fonts/',
    },
    src: {
        html: [sourceFolder + '/*.html', '!' + sourceFolder + '/_*.html'],
        css: sourceFolder + '/scss/style.scss',
        js: sourceFolder + '/js/script.js',
        img: sourceFolder + '/img/**/*.{png,jpg,svg,gif,ico,webp}',
        fonts: sourceFolder + '/fonts/*.ttf',
    },
    watch: {
        html: sourceFolder + '/**/*.html',
        css: sourceFolder + '/scss/**/*.scss',
        js: sourceFolder + '/js/**/*.js',
        img: sourceFolder + '/img/**/*.{png,jpg,svg,gif,ico,webp}',
    },
    clean: './' + projectFolder + '/'
};


let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'), // плагин позволяет ссылаться на другйо html файл и включать ег ов основной
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'), // собирает все разбросаныне мудиа запроы в 1 файл
    cleans_css = require('gulp-clean-css'), // чистит и сжимает css файл на выходе
    rename = require('gulp-rename'), // плагин позвоялет переиминовывать файлы и добавлять .min
    uglify = require('gulp-uglify-es').default, // плагин позволяет сжимать файлы js
    imagemin = require('gulp-imagemin'), // плагин для оптимизации картинок
    webp = require('gulp-webp'), // плагин для сжатия и переноса в формат webp картинок
    webphtml = require('gulp-webp-html'), // плагин для создание тега picture 
    webpcss = require('gulp-webp-css'), // плагин для использованяи формата webp в css 
    svgSprite = require('gulp-svg-sprite'), // плагин для создания svg-sprites 
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter'),
    concat = require("gulp-concat"),
    babel = require("gulp-babel");


function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './' + projectFolder + '/'
        },
        port: 3000,
        notify: false

    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}


function style() {
    //создаём единую библиотеку из css-стилей всех плагинов
    return gulp
        .src([
            //указываем, где брать исходники
            'node_modules/normalize.css/normalize.css',
            'node_modules/slick-carousel/slick/slick.css',
			'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.css',
			'node_modules/animate.css/animate.css'
        ])
        .pipe(concat('libs.min.css')) //склеиваем их в один файл с указанным именем
        // .pipe(scss()) //минифицируем полученный файл
        .pipe(dest(path.build.css));
    //кидаем готовый файл в директорию
}

function script() {
    //аналогично поступаем с js-файлами
    return gulp
        .src([
            //тут подключаем разные js в общую библиотеку. Отключите то, что вам не нужно.
            'node_modules/jquery/dist/jquery.js',
            'node_modules/slick-carousel/slick/slick.js',
            'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
			'node_modules/wow.js/dist/wow.js',
			'node_modules/smooth-scroll/dist/smooth-scroll.polyfills.js',
			'node_modules/spincrement/dist/jquery.spincrement.js'
        ])
        .pipe(babel({
            presets: ["@babel/preset-env"],
            plugins: [
                  ["@babel/plugin-transform-modules-commonjs", {
                    "allowTopLevelThis": true
                  }]
                ]
          }))
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
}


function css() {
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle: 'expanded'
            })
        )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        // .pipe(webpcss({ webpClass: '.webp', noWebpClass: '.no-webp' }))
        .pipe(dest(path.build.css))
        .pipe(cleans_css())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(babel({
            presets: ["@babel/preset-env"],
            plugins: [
                  ["@babel/plugin-transform-modules-commonjs", {
                    "allowTopLevelThis": true
                  }]
                ]
          }))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: '.min.js'
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}


function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 // от 0 до 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream());
}

function fonts(params) {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
}

gulp.task('otf2ttf', function () {
    return src([sourceFolder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourceFolder + '/fonts/'));
});

gulp.task('svgSprite', function () {
    return gulp.src([sourceFolder + '/iconsprite/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: '../icons/icons.svg',
                    example: true
                }
            },
        }))
        .pipe(dest(path.build.img));
});

function fontsStyle(params) {
    let file_content = fs.readFileSync(sourceFolder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(sourceFolder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(sourceFolder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        });
    }
}

function cb() { }

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(style, script, css, js, html, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);



exports.style = style;
exports.script = script;
exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;