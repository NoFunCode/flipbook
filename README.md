<div align="center">

# 🚀 Typescript NPM Library Template
[![npm](https://img.shields.io/npm/v/@happyeyal/typescript-package-starter?style=flat-square)](https://www.npmjs.com/package/@happyeyal/typescript-package-starter)
[![npm](https://img.shields.io/npm/dt/@happyeyal/typescript-package-starter?style=flat-square)](https://www.npmjs.com/package/@happyeyal/typescript-package-starter)
[![npm](https://img.shields.io/npm/l/@happyeyal/typescript-package-starter?style=flat-square)](https://www.npmjs.com/package/@happyeyal/typescript-package-starter)
[![npm](https://img.shields.io/github/issues-raw/@happyeyal/typescript-package-starter?style=flat-square)](https://www.npmjs.com/package/@happyeyal/typescript-package-starter)

</div>

## Features
| Tool | Description |
| --- | --- |
| <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="Typescript" width="30" height="30"> | Typescript |
| <img src="https://vitest.dev/favicon.ico" alt="Vitest" width="30" height="30"> | Vitest |
| <img src="https://github.com/get-icon/geticon/raw/master/icons/eslint.svg" alt="Prettier" width="30" height="30"> | Code Linting |
| 🐶 | Pre-commit Hooks |
| <img src="https://github.githubassets.com/favicons/favicon.svg" alt="Github Actions" width="30" height="30"> | Releasing versions to NPM |
| <img src="https://editorconfig.org/favicon.ico" alt="EditorConfig" width="30" height="30"> | Consistent coding styles across different editors |
| <img src="https://prettier.io/icon.png" alt="Prettier" width="30" height="30"> | Code Formatting |
| <img src="https://rollupjs.org/rollup-logo.svg" alt="Rollup" width="30" height="30"> | Module bundler for JavaScript |

## Getting Started

1. Create a new repository using this one as template

2. Create 2 core branches: `dev` and `main`.

   2.1 `dev` will serve all your versions.

   2.2 new additions should be pushed to `main` when they have been approved/tested appropriately.

3. Clone your repo
4. Install dependencies with `npm install`
5. Run `npm run prepare` command to setup [Husky](https://typicode.github.io/husky) pre-commit hooks.

### Main Scripts

Always prepending yarn:

- `build`: Builds the static storybook project.
- `lint:fix`: Applies linting based on the rules defined in **.eslintrc.js**.
- `format:prettier`: Formats files using the prettier rules defined in **.prettierrc**.
- `test`: Runs testing using watch mode.
- `test:cov`: Runs testing displaying a coverage report.

### Publishing the Library to NPM

**Using Github as the hosting service:**

1. Check the `Allow GitHub Actions to create and approve pull requests` box under the Settings>Code and automation>Actions>General repository configuration. This will allow the release-please workflow to create a PR increasing the version.
2. Create a repository secret called `NPM_TOKEN` under Settings>Security>Secrets and variables>Actions for the github action to be able to publish the library to npm.

With these 2 requirements, Pull Requests raised by release-please will have enough permissions. For more details, check the [official documentation](https://github.com/google-github-actions/release-please-action).

### Versioning

Following [Conventional Commits](https://www.conventionalcommits.org/).

**release-please** will bump a patch version if new commits are only fixes.

It will bump a minor version if new commits include a _feat_.

`feat!`, `fix!`, `refactor!`, etc., which represent a breaking change, will result in a major version.

In order to change the version manually (i.e. force it), a new commit has to be created including `Release-As: X.X.X` as the description.
Example: `git commit -m "chore: v1.2.0" -m "Release-As: 1.2.0"`

## Author

<img src="https://media.licdn.com/dms/image/D4D03AQE_bxd8zdkpdA/profile-displayphoto-shrink_800_800/0/1687167840824?e=1717632000&v=beta&t=sWgOo4n1AQdiEq8PBanUtR2oZbQbX65I73229cdYu3k" alt="Profile Picture" width="50" height="50">

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/eyalevi/)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-black?style=flat-square&logo=github)](https://github.com/LeviEyal)

## License
[MIT](LICENSE)

## Support

If you find this library helpful, consider buying me a coffee to show your support!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Me-orange?style=flat-square&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/happyeyal)