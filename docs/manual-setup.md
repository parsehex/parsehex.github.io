# Manual Setup

These instructions are for those who don't want to use GitHub's [Fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) feature to consume the project.

I also have/had to do this in order to use this project for the <https://ProjectDepot.github.io/> page - I'm writing this page while doing that.

## Prerequisites

You should have [Git](https://git-scm.com/install/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

## Initial Setup

1. Create a repository on GitHub called the following using your username: **`USERNAME.github.io`** and set it to **Public**.

2. Clone the project, setting the name appropriately as you did above.

```bash
git clone https://github.com/ProjectDepot/SrcGallery USERNAME.github.io
cd USERNAME.github.io
```

3. (optional) Copy the `src/config.user.ts.example` file and name it **`src/config.user.ts`**. You can [learn about this file here](./config).

4. Now for some git commands to add your. In the second command below, you should **replace `USERNAME` with your username.**

```bash
git remote remove origin
git remote add origin git@github.com:USERNAME/USERNAME.github.io.git
```

5. Set your repo to receive updates from the main repo:

```bash
git remote add upstream https://github.com/ProjectDepot/SrcGallery.git
```

6. Push to GitHub.

```bash
git push -u origin main
```

7.

```bash
git config pull.rebase false
```

8. Enable GitHub Pages by going to your repo's **Settings -> Pages** and set the Branch to `gh-pages`.

## Updating

You'll need to have the repo cloned locally and run the following to pull changes form the main repo and to push them to your project on GitHub:

```bash
git pull upstream main
git push origin main
```
