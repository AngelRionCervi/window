const gulp = require("gulp");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const rollup = require("gulp-better-rollup");
const strip = require("gulp-strip-comments");
const stripDebug = require("gulp-strip-debug");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");

const jsFiles = "./justAnotherWin.js";
const dest = "./dist/";

gulp.task("build", function () {
    return gulp
        .src(jsFiles)
        .pipe(
            rollup(
                {
                    format: "umd",
                }
            )
        )
        .pipe(
            babel({
                presets: ["@babel/env"],
                plugins: ["@babel/plugin-proposal-class-properties"],
            })
        )
        .pipe(strip())
        .pipe(stripDebug())
        .pipe(rename("justAnotherWin.js"))
        .pipe(gulp.dest(dest))
        .pipe(rename("justAnotherWin.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(dest));
});

/*
gulp.task("webpack", () => {
    return gulp
        .src(jsFiles)
        .pipe(
            babel({
                presets: ["@babel/env"],
                plugins: ['@babel/plugin-proposal-class-properties']
            })
        )
        .pipe(concat("windows.js"))
        .pipe(webpackStream(require("./webpack.config.js")))
        .pipe(gulp.dest(dest));
});
gulp.task("default", ["webpack"]);*/
