# Website Data

The main editable metadata source for the website is:

- `data/site-data.js`

Use it for:

- site identity and footer text
- social links
- About page contact card
- About page working stack
- blog archive items
- project archive items
- project detail-page metadata
- search source coverage

Current structure inside `site-data.js`:

- `site`
- `about`
- `projects`
- `blogs`

Editing pattern:

1. Update the matching object in `data/site-data.js`
2. If it is a new blog, add a new HTML article page in `blogs/`
3. If it is a new project, add a new HTML detail page in `projects/`
4. Keep the `slug` aligned with the filename

Examples:

- blog slug `human-data` -> `blogs/human-data.html`
- project slug `cltr` -> `projects/cltr.html`

Notes:

- Archive cards are now generated from `data/site-data.js`
- Footer social links and footer tagline are also generated from `data/site-data.js`
- Long-form blog article body content still lives in each article HTML file
- If you want the same pattern for homepage hero copy or publications metadata next, extend `site-data.js` and bind it in `script.js`
