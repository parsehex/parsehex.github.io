# Plans for SrcGallery

## Project Name

~~The name ProjectDepot Gallery kind of sucks / is long, so I want to come up with something better.~~

I think `SrcGallery` is decent.

## Main Page

### Project Groups

I'd like to be able to group projects together in an optionally-collapsible section. For my site, I'd put the projects under ProjectDepot in a group.

### Extra Content Section(s)

I'd like the user to be able to add extra content to the main page, such as a bio or a list of links to other sites.

## Demo Command/Mode

It makes sense to me to have a script to generate an example set of content. This would be useful to see what can be done with the project.

## Project Pages

This would be a feature where you can create a page for listed projects which will be linked to from the main page.

You would simply add a `<project-name>.md` file to the `content/projects` directory. Projects with one of these files would have a link to that page on the main page.

**Update**: Early Implementation

If you add a Markdown file named after your repository (e.g., `my-repo.md`) to the `content/projects` directory, a "Learn more" link will automatically appear for that project on the main page, directing users to this dedicated project page.

## New Config File

I think [Extra Content](#extra-content-sections) will need to use a JS/TS file, plus we're using Astro now which tends to do that for config files. So I think we should move the current config to a JS/TS file and then we can add new config options to it.

## Lighthouse Score

I want to automate the process of getting and displaying a Lighthouse score. I'm not sure on running it on every commit, but at least an npm script to run it manually would be good. We can also output it as html to a page in the docs.
