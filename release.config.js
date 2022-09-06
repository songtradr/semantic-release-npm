const { major, minor, prerelease } = require("semver");

module.exports = {
  branches: ["+([0-9])?(.{+([0-9]),x}).x", "main", "next"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    {
      async publishSuccessful(version) {
        if (prerelease(version)) {
          this.log.info(
            "Prerelease version detected; will not add a major version tag."
          );
          return;
        }
        const versionTags = [
          major(version),
          `${major(version)}.${minor(version)}`,
        ];
        for (const v of versionTags) {
          this.log.info(`Deleting version tag ${v} from origin.`);
          await this.shell.exec(`git push origin :refs/tags/v${v}`);

          this.log.info(`Pushing new version tag ${v} to git.`);
          await this.shell.exec(`git tag --force v${v}`);
          await this.shell.exec(`git push origin v${v}`);
        }
      },
    },
  ],
};
