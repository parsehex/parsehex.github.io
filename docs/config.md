# Configuration

To customize the app, edit the configuration file `src/config.user.ts`.

## siteTitle

- Type: `string`
- Default: `"{username}'s Sites"`

Customize the main site title. Use `{username}` to include the GitHub username (it will be linked to the profile on GitHub).

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  siteTitle: '{username}',
};
```

## headerText

- Type: `string`
- Default: `"A list of my projects that have a GitHub Pages site."`

Enable/Disable or change the text to the right of your profile image. If value is an empty string or undefined, then your GitHub bio will be displayed instead.

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  headerText: '',
};
```

## profileHeader

- Type: `boolean`
- Default: `true`

Enable/Disable the profile header, which includes 1) GitHub avatar, 2) username, and 3) bio or `headerText`.

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  profileHeader: false,
};
```

## profileHeaderCenter

- Type: `boolean`
- Default: `false`

Whether to vertically-center the profile header (avatar/username, subtitle, and social buttons).

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  profileHeaderCenter: true,
};
```

## hero

- Type: `boolean | { center: boolean; truncationHeight: number; }`
- Default: `{ center: false, truncationHeight: 300 }`

Enable/Disable or configure the alignment of the hero text, and adjust the height at which the hero content is cut off with an expand button.

```ts{4-7}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  hero: {
    center: true,
    truncationHeight: 500,
  },
};
```

## controls

- Type: `boolean`
- Default: `true`

Enable/Disable the controls (search, sort, and topic filter).

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  controls: false,
};
```

## displayView

- Type: `'grid' | 'list'`
- Default: `'grid'`

Set the default view mode ('grid' or 'list').

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  displayView: 'list',
};
```

## footerText

- Type: `string`
- Default: `''` (empty string)

Customize footer text.

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  footerText: 'My Custom Footer',
};
```

## creditLink

- Type: `boolean`
- Default: `true`

Enable/Disable the credit link (to this project). I appreciate keeping it enabled.

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  creditLink: false,
};
```

## links

- Type: `{ name?: string; url: string; icon?: string }[]`
- Default: `[]`

Add custom links to the header (e.g., social media profiles).

- **name**: Tooltip text for the link.
- **url**: The URL to link to.
- **icon**: Optional icon name (from [Tabler Icons](https://tabler-icons.io/)). If omitted, the name is displayed.

```ts{4-10}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  links: [
    {
      name: 'Twitter',
      url: 'https://twitter.com/username',
      icon: 'brand-twitter',
    },
  ],
};
```

## extraRepos

- Type: `string[]`
- Default: `undefined`

Add repositories from other accounts or organizations. These will be fetched and displayed using their full name (owner/repo).

```ts{4}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  extraRepos: ['owner1/repo1', 'owner2/repo2'],
};
```

## Background Colors

- Type: `{ gradientColors: { topLeft: string; topRight: string; } }`
- Default: `{ gradientColors: { topLeft: 'rgba(96, 165, 250, 0.15)', topRight: 'rgba(147, 51, 234, 0.15)' } }`

Customize the background gradient colors by setting a color for the top-left and -right corners.

```ts{4-9}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  theme: {
    gradientColors: {
      topLeft: '#ff0000',
      topRight: '#0000ff',
    },
  },
};
```

### Get Random Colors

You can run the following to get 2 colors you can use above:

```bash
npm run bg-colors
```

To list several colors that you can choose from, run:

```bash
npm run bg-colors -- --all
```

## Custom Filters

The default filter shows repositories with a homepage URL.

To customize which repos are displayed:

Add a `reposFilter` to your user config which takes an array of repositories and also returns an array of repositories. Below sets a filter identical to the default one -- showing repos that include a `homepage` link:

```ts{4-6}
import type { Config } from './types';

export const userConfig: Partial<Config> = {
  reposFilter: (data) => {
    return data.filter((repo) => repo.homepage);
  },
};
```

You can find some other example filters below. Note that you can **only return once**, so if you combine filters then you'll need to modify or chain the filters:

```ts{4,7,10,13,16,19-21}
// == Filter Examples ==

// repos with a homepage URL (default filter)
return data.filter((repo) => repo.homepage);

// repos with a homepage URL + a description
return data.filter((repo) => repo.homepage && repo.description);

// exclude forks
return data.filter((repo) => !repo.fork);

// naming convention - only repos starting with "portfolio-"
return data.filter((repo) => repo.name.startsWith('portfolio-'));

// only repos with topics
return data.filter((repo) => repo.topics && repo.topics.length > 0);

// repos updated in the last year
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
return data.filter((repo) => new Date(repo.updated_at) > oneYearAgo);
```

Note that this filter function **affects the repos list at build-time** (used during `npm run fetch-data`).
