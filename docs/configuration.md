# Configuration

## Configuration Overview

To customize the app, create your own configuration file:

1. Copy `config.user.json.example` to `config.user.json` in the root of your repository.
2. Edit `config.user.json` to make your changes. See below for options.

## Available Customizations

### Header

- **Enable/Disable the app's Header**
- **Header Text**: Enable/Disable or change the text to the right of your profile image (set to a blank string to disable)

### Hero Section

Configure the hero section:

```json
{
	"hero": {
		"src": "/hero.md",
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
