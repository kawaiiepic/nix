// main scss file
const scss = `${App.configDir}/style/css/style.scss`

// target css file
const css = `/tmp/my-style.css`

// make sure sassc is installed on your system
Utils.exec(`dart-sass ${scss} ${css}`)

App.resetCss() // reset if need

App.applyCss(css)