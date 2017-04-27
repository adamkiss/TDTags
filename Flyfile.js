const sass = "src/style.scss"
const js = "src/script.js"
const dist = "dist"

module.exports = {
  *scripts(fly) {
    yield fly.source(js).babel({ presets: ["es2015"] }).target(`${dist}/`)
  },
  *styles(fly) {
    yield fly.source(sass).sass().target(`${dist}/`)
  },
  *build(fly) {
    yield fly.parallel(["scripts", "styles"])
  },
  *default(fly) {
  	yield fly.watch("src/*.js", "scripts")
  	yield fly.watch("src/*.scss", "styles")
  }
}