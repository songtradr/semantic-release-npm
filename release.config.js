const { promisify } = require("node:util");
const exec = promisify(require("node:child_process").exec);

/** @type {import('semantic-release').Options} */
module.exports = {
  branches: ["+([0-9])?(.{+([0-9]),x}).x", "main", "next"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    {
      /**
       * @param {*} _
       * @param {import('semantic-release').Context} param1
       */
      success(_, { nextRelease: { version }, logger }) {
        if (version.match(/[^0-9\.]/)) {
          logger.info(
            "Prerelease version detected; will not add a major version tag."
          );
          return;
        }
        const [major, minor] = version.split(".");

        return Promise.all(
          [major, `${major}.${minor}`].map(async (v) => {
            logger.info(`Pushing new version tag ${v} to git.`);
            await exec(`git tag --force v${v}`);
            await exec(`git push origin v${v} --force`);
          })
        );
      },
    },
  ],
};
