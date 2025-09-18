# GitCase

> You've already created your projects -- show them off without spending more time.

GitCase is a ready-to-use template that deploys a zero-maintenance landing page to your [USERNAME].github.io repository. With a single click, your GitHub repositories are showcased and updated everyday via GitHub Actions. No manual updates needed—just point it at your GitHub account and let it run.

## Key Features

• Automatic daily updates via GitHub Actions – set-and-forget
• Displays only repositories with a homepage URL or using your own filter
• Interactive UI with layout and sorting options
• Built with React, TypeScript, and Vite for a modern development experience

## Getting Started

1. Fork this repository and use the the name **_USERNAME_.github.io** -- replace USERNAME with your GitHub profile's name.
2. Go to the **Actions** tab at the top. You'll see a message explaining that scheduled workflows have been automatically disabled. To continue setting up, click the **I understand my workflows** button. Next, go to **Build and Deploy to GitHub Pages** on the left, then click **Enable workflow**. Finally, click **Run workflow** to begin the first build.
3. Now go to **Settings** -> **Pages**. Open the **Branch** dropdown, select the **_gh-pages_** branch and click **Save**.

Done! The site will start building and should be online soon at **_USERNAME_.github.io**.

To customize the app, proceed to the following sections.

## Customization

- **Change hero text and more**: `config.json` can point to a `.md` file to display something at the top of the page.
- **Update repo list filter**: To change which repositories are listed, modify `scripts/fetch-data.js` (look for the label `// REPO LIST FILTER`).

## Demo

To see a working demo of GitCase in action, check out my copy at [parsehex.github.io](https://parsehex.github.io/).

## Local Development Setup

If you want to run the project locally:

1. Clone the repo:

   git clone <https://github.com/GitCase-app/GitCase>
   cd GitCase

2. Copy `.env.example` to `.env` and update the GitHub username:
   • Example:

   VITE_GITHUB_ACTOR=**your_username**

   (Note: When deployed via GitHub Actions, the workflow handles the configuration automatically.)

3. Install dependencies:

   npm install

4. Fetch initial data for your GitHub profile by running:

   npm run fetch-data

5. Start the development server:

   npm run dev

## License

This project is licensed under the [MIT License](LICENSE).
