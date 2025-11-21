# Configuration

## Configuration Overview

To customize the app, create your own configuration file:

1. Copy `config.user.json.example` to `config.user.json` in the root of your repository.
2. Edit `config.user.json` to make your changes. See below for options.

## Available Customizations

### Header

- **Enable/Disable the app's Header**
- **Site Title**: Customize the main site title. Use `{username}` to include the GitHub username (it will be linked to the profile on GitHub).
- **Header Text**: Enable/Disable or change the text to the right of your profile image (set to a blank string to disable)

```json
{
	"header": true,
	"siteTitle": "{username}'s Sites",
	"headerText": "A list of my projects that have a GitHub Pages site.",
	"links": [
		{
			"name": "Twitter",
			"url": "https://twitter.com/username",
			"icon": "brand-twitter"
		}
	]
}
```

### Header Links

You can add custom links to the header (e.g., social media profiles).

- **name**: Tooltip text for the link.
- **url**: The URL to link to.
- **icon**: Optional icon name (from [Tabler Icons](https://tabler-icons.io/)). If omitted, the name is displayed.

```json
{
	"links": [
		{
			"name": "Blog",
			"url": "https://example.com"
		}
	]
}
```

### Hero Section - Use Your GitHub README

You can use your [GitHub profile README][GH-p-r] as your hero text by creating a repository that's named your username.

For example I named mine `parsehex`, i.e. I have a repository called [`parsehex/parsehex`](https://github.com/parsehex/parsehex) that's just the README.

[GH-p-r]: https://docs.github.com/en/account-and-profile/how-tos/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme

You can also configure the alignment of the hero text:

```json
{
	"hero": {
		"center": true
	}
}
```

### Display Mode

Set the default view:

```json
{
	"display": {
		"view": "list"
	}
}
```

### Footer

Customize footer text and link:

```json
{
	"footer": {
		"text": "Your custom text",
		"includeGitCaseLink": false
	}
}
```

### Extra Repositories

Add repositories from other accounts or organizations:

```json
{
	"extraRepos": ["owner1/repo1", "owner2/repo2"]
}
```

These will be fetched and displayed using their full name (owner/repo).

## Custom Filters

The default filter shows repositories with a homepage URL. To customize which repos are displayed:

1. Copy `scripts/repo-filter.js.example` to `scripts/repo-filter.js` in your fork.
2. Edit the `getFilteredRepos` function in `repo-filter.js` to apply your desired filter (examples are commented in the file).

## GitHub Setup

When deployed via GitHub Actions, the workflow handles the configuration automatically. For local development, you'll need to set up your environment variables (see the [Development](./development) section).
