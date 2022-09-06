const PR_COMMENT_TEMPLATE = `## Test this PR 🧪

- version \`<%= version %>\`
- published at **<% print(date.format('ddd, MMM DD YYYY - HH:mm:ss [GMT]Z')) %>**
- based on <%= gitHead %>

\`\`\`bash
yarn add <%= name %>@<%= channel %>
\`\`\``;

module.exports = {
  branches: [
    "+([0-9])?(.{+([0-9]),x}).x",
    "main",
    "master",
    "next",
    "next-major",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true },
  ],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/npm",
    process.env.PRE_RELEASE && [
      "decorate-gh-pr/on-release",
      { prepend: false, comment: PR_COMMENT_TEMPLATE },
    ],
    !process.env.PRE_RELEASE && "@semantic-release/github",
  ].filter(Boolean),
};
