const gulp = require("gulp");
const { series } = require("gulp");
const webp = require("gulp-webp");
const download = require("gulp-download2");
const Ddragon = require("ddragon");
const fetch = require("node-fetch");
const decompress = require("gulp-decompress");

let dd = new Ddragon();

let version = "";

function downloadDdVersion(done) {
  fetch(dd.versions())
    .then((res) => res.json())
    .then((versions) => {
      version = versions[0];
      console.log("ddragon version", version);
      done();
    });
}

function downloadDragonTail() {
  return download(
    `https://ddragon.leagueoflegends.com/cdn/dragontail-${version}.tgz`
  ).pipe(gulp.dest("./temp"));
}

function extractFiles() {
  const path = `./temp/dragontail-${version}.tgz`;
  return gulp.src(path).pipe(decompress()).pipe(gulp.dest("temp/extract"));
}

function convertFiles() {
  return gulp
    .src("temp/extract/**/*")
    .pipe(webp())
    .pipe(gulp.dest("./public/"));
}

exports.default = series(
  downloadDdVersion,
  downloadDragonTail,
  extractFiles,
  convertFiles
);
