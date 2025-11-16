# Getting Started

## Setup

1. **Fork this repository** and use the name `USERNAME.github.io` -- replace USERNAME with your GitHub profile's name.

2. **Enable GitHub Actions workflow**:

   - Go to the **Actions** tab at the top
   - You'll see a message explaining that scheduled workflows have been automatically disabled
   - Click the **"I understand my workflows"** button
   - Go to **"Build and Deploy to GitHub Pages"** on the left
   - Click **"Enable workflow"**
   - Finally, click **"Run workflow"** to begin the first build

3. **Configure GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Open the **Branch** dropdown
   - Select the **`gh-pages`** branch and click **Save**

Done! The site will start building and should be online soon at `USERNAME.github.io`.

## Key Features

- **Automatic daily updates** via GitHub Actions – set-and-forget
- **Displays only repositories with a homepage URL** or [using your own filter](./configuration#custom-filters)
- **Interactive UI** with layout and sorting options
- **Built with modern technologies**: Vue, TypeScript, and Vite

## Demo

To see a working demo of Gallery in action, check out [parsehex.github.io](https://parsehex.github.io/).

## Updating

When Gallery updates upstream, you can easily bring in the changes to your copy of the app by going to **your repo** → **Sync fork** → **Update branch**, which will start the re-building process.
