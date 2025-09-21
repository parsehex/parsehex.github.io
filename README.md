# Project Depot Gallery

<!-- TODO add option clearDeadLinks to clear  the .homepage value of inactive links (which should remove when using the default filter) -->

> You've already created your projects -- show them off without spending more time.

Project Depot Gallery is a ready-to-use template that deploys a zero-maintenance landing page to your [USERNAME].github.io repository. With a single click, your GitHub repositories are showcased and updated everyday via GitHub Actions. No manual updates needed—just point it at your GitHub account and let it run.

## Key Features

- Automatic daily updates via GitHub Actions – set-and-forget
- Displays only repositories with a homepage URL or [using your own filter](#customization)
- Interactive UI with layout and sorting options
- Built with Vue, TypeScript, and Vite for a modern development experience

## Getting Started

1. Fork this repository and use the the name **_USERNAME_.github.io** -- replace USERNAME with your GitHub profile's name.
2. Go to the **Actions** tab at the top. You'll see a message explaining that scheduled workflows have been automatically disabled. To continue setting up, click the **I understand my workflows** button. Next, go to **Build and Deploy to GitHub Pages** on the left, then click **Enable workflow**. Finally, click **Run workflow** to begin the first build.
3. Now go to **Settings** -> **Pages**. Open the **Branch** dropdown, select the **_gh-pages_** branch and click **Save**.

Done! The site will start building and should be online soon at **_USERNAME_.github.io**.

To customize the app, proceed to the following sections.

## Customization

To customize the app, create your own configuration file:

1. Copy `config.user.json.example` to `config.user.json` in the root of your repository.
2. Edit `config.user.json` to make your changes. See below for options.

**Available customizations in config.user.json:**

- **Header**: Enable/Disable the app's Header.
- **Header Text**: Enable/Disable or change the text to the right of your profile image (set to a blank string to disable).
- **Hero**: Configure the hero section, e.g., `"hero": { "src": "/path/to/your-hero.md", "center": true }` to display custom markdown at the top.
- **Display mode**: Set the default view, e.g., `"display": { "view": "list" }`.
- **Footer**: Customize footer text and link, e.g., `"footer": { "text": "Your custom text", "includeGitCaseLink": false }`.
- **Extra Repos**: Add repositories from other accounts or organizations: `"extraRepos": ["owner1/repo1", "owner2/repo2"]`. These will be fetched and displayed using their full name (owner/repo).

- **Update repo list filter**: The default filter shows repositories with a homepage URL. To customize which repos are displayed:

  1. Copy `scripts/repo-filter.js.example` to `scripts/repo-filter.js` in your fork.
  2. Edit the `getFilteredRepos` function in `repo-filter.js` to apply your desired filter (examples are commented in the file).

## Updating

When Gallery updates upstream, you can easily bring in the changes to your copy of the app by going to **your repo** -> **Sync fork** -> **Update branch**, which will start the re-building process.

## Demo

To see a working demo of Gallery in action, check out my copy at [parsehex.github.io](https://parsehex.github.io/).

## Local Development Setup

If you want to run the project locally:

1. Clone the repo:

   git clone <https://github.com/ProjectDepot/Gallery>
   cd Gallery

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
