# GitCase

> You've already created your projects -- show them off without spending more time.

GitCase is a ready-to-use template that deploys a zero-maintenance landing page to your [USERNAME].github.io repository. With a single click, your GitHub repositories are showcased and updated everyday via GitHub Actions. No manual updates needed—just point it at your GitHub account and let it run.

## Key Features

• Automatic daily updates via GitHub Actions – set-and-forget
• Displays only repositories with a homepage URL or using your own filter
• Interactive UI with layout and sorting options
• Built with React, TypeScript, and Vite for a modern development experience

## Getting Started

1. Create a new repository using this template with the name **USERNAME.github.io** (replace USERNAME with your GitHub profile's name).
2. Done! The app will start building and should be online soon.

To customize the app, proceed to the following sections.

## Local Development Setup

If you want to run the project locally:

1. Copy `.env.example` to `.env` and update the GitHub username:
   • Example:

   VITE_GITHUB_ACTOR=johnsmith

   (Note: When deployed via GitHub Actions, the workflow handles the configuration automatically.)

2. Install dependencies:

   npm install

3. Fetch your project’s initial data by running:

   npm run fetch-data

4. For local development start the server:

   npm run dev

## Customization

- **Enable/Disable or Change hero text**: Change `config.json` to point the `hero.src` property to a `.md` file or make the value blank (i.e. `"src": "",`). For example, to use your repo's readme, use `"src": "./README.md",`
- **Change repo list filter**: To change which repositories are listed, modify `scripts/fetch-data.js` (look for the label `// REPO LIST FILTER`).

## Demo

To see a working demo of GitCase in action, check out mine at [parsehex.github.io](https://parsehex.github.io/).

## License

This project is licensed under the [MIT License](LICENSE).
