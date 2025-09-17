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
2. Open your new repo and go to **Settings**.
   1. Go to the **Actions** -> **General** tab. Set **Workflow permissions** to **_Read and write permissions_**.
   2. Go to the **Pages** tab. Open the **Branch** dropdown and select the **_gh-pages_** branch.
3. Now, go to the **Actions** tab at the top. You should see a red/failed build -- please click on it and then click the button in the upper-right corner to **Re-run failed jobs**.
4. Done! The app will start building and should be online soon.

To customize the app, proceed to the following sections.

## Customization

- **Change hero text and more**: `config.json` can point to a `.md` file to display something at the top of the page.
- **Update repo list filter**: To change which repositories are listed, modify `scripts/fetch-data.js` (look for the label `// REPO LIST FILTER`).

## Demo

To see a working demo of GitCase in action, check out my copy at [parsehex.github.io](https://parsehex.github.io/).

## Local Development Setup

If you want to run the project locally:

1. Copy `.env.example` to `.env` and update the GitHub username:
   • Example:

   VITE_GITHUB_ACTOR=**your_username**

   (Note: When deployed via GitHub Actions, the workflow handles the configuration automatically.)

2. Install dependencies:

   npm install

3. Fetch your project’s initial data by running:

   npm run fetch-data

4. For local development start the server:

   npm run dev

## License

This project is licensed under the [MIT License](LICENSE).
