const pkg = require("./package.json");
const { version, name } = pkg;
const fs = require("fs");
const { spawnSync } = require("child_process");

const gitOutput = spawnSync("git", ["rev-parse", "HEAD"]);
const gitSha = gitOutput.stdout.toString().substr(0, 7);

const BUILD_ROOT = "./dist";
const BUILD_NAME = `${name}-${version}-${gitSha}`;
const ZIP_FILE = `${BUILD_ROOT}/${BUILD_NAME}.zip`;

console.log(`Building ${BUILD_NAME}`);

console.log("==============================================");
console.log(`cleaning ${BUILD_ROOT}`);
fs.rmdirSync(BUILD_ROOT, { recursive: true });
fs.mkdirSync(BUILD_ROOT);
fs.copyFileSync("./.htaccess", "./build/.htaccess");

spawnSync("npm run clean-build", [], {
  stdio: ["inherit", "inherit", "inherits"],
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: "production",
    REACT_APP_VERSION: `${version}-${gitSha}`,
    REACT_APP_WS_ENDPOINT: "wss://backchannel-server.herokuapp.com",
    REACT_APP_REST_API_ENDPOINT: "https://backchannel-server.herokuapp.com",
  },
});

spawnSync(`zip -v ../${ZIP_FILE} ./* ./**/*`, [], {
  cwd: "./build",
  shell: true,
  stdio: ["inherit", "inherit", "inherits"],
});

console.log(`Built to: ${ZIP_FILE}`);
