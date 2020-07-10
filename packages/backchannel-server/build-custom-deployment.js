const pkg = require("./package.json");
const { version, name, packageContents } = pkg;
const fs = require("fs");
const { exec } = require("child_process");

const BUILD_ROOT = "./build";
const BUILD_NAME = `${name}-${version}`;
const ZIP_FILE = `${BUILD_ROOT}/${BUILD_NAME}.zip`;

console.log(`Building ${name} v${version}`);

console.log("==============================================");
console.log(`cleaning ${BUILD_ROOT}`);
fs.rmdirSync(BUILD_ROOT, { recursive: true });
fs.mkdirSync(BUILD_ROOT);

exec(
  `zip -v ${ZIP_FILE} ${packageContents.join(" ")}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error.message);
    }
    if (stderr) {
      console.error(stderr);
    }
    console.log(stdout);
    console.log(`Built to: ${ZIP_FILE}`);
  }
);
