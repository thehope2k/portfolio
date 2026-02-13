# The Hope's Portfolio

A personal portfolio website built with Astro, TypeScript, and Markdown. This project showcases professional experience, personal writing, and a growth/learning section.

## Features

- **Professional Section**: Resume-like information including skills, projects, and contact details
- **Personal Section**: Space for creative writing and personal projects
- **Growth Section**: Blog-style area for sharing learning notes, reflections, and tutorials
- Responsive design
- Easy navigation between sections
- Markdown-based content for easy updates
- GitHub Pages deployment ready

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/thehope2k/portfolio.git
cd portfolio
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

## Deployment

This project is configured for deployment with a custom domain:

1. The `site` and `base` in `astro.config.ts` are configured as:
```ts
export default defineConfig({
  site: 'https://thehope2k.com',
  base: '/',
  output: 'static'
});
```

2. The custom domain is set in `public/CNAME`

3. Run the deployment command:
```
npm run deploy
```

This will build the site and deploy it to the `gh-pages` branch of your repository, which is served at the custom domain.

## Updating Content

### Professional Section

To update your professional information, edit the `src/pages/professional.astro` file:

- **About Me**: Update the text in the paragraphs under "About Me"
- **Skills**: Modify the skills in each category
- **Projects**: Add or remove project cards in the projects grid
- **Contact**: Update the href attributes with your actual email and social media links

### Personal Section

To update your personal writing:

1. **Main Page**: Edit `src/pages/personal.astro` to update the writing philosophy and list of writings
2. **Individual Writings**: 
   - Create new markdown files in the `src/pages/personal/` directory
   - Use the frontmatter format as shown in existing files:
   ```md
   ---
   layout: ../../layouts/BlogPostLayout.astro
   title: Your Title
   date: YYYY-MM-DD
   category: Essay/Story/etc.
   description: A brief description of your writing.
   ---
   
   # Your content here
   ```

### Growth Section

To update your growth/learning content:

1. **Main Page**: Edit `src/pages/growth.astro` to update the learning philosophy and list of posts
2. **Individual Posts**: 
   - Create new markdown files in the `src/pages/growth/` directory
   - Use the frontmatter format as shown in existing files:
   ```md
   ---
   layout: ../../layouts/BlogPostLayout.astro
   title: Your Title
   date: YYYY-MM-DD
   category: Tutorial/Notes/etc.
   description: A brief description of your post.
   tags: ["Tag1", "Tag2", "Tag3"]
   ---
   
   # Your content here
   ```

## Project Structure

```
/
├── public/             # Static assets
├── src/
│   ├── pages/          # All pages and posts
│   │   ├── index.astro # Homepage
│   │   ├── professional.astro
│   │   ├── personal.astro
│   │   ├── growth.astro
│   │   ├── personal/   # Personal writing markdown files
│   │   └── growth/     # Growth posts markdown files
│   ├── layouts/        # Page layouts
│   └── components/     # UI components
├── astro.config.ts     # Astro configuration
└── package.json
```

## Customization

### Styling

The site uses CSS variables for consistent theming. To change the color scheme, edit the `:root` section in `src/layouts/MainLayout.astro`.

### Adding New Sections

To add a new section to the site:

1. Create a new page in `src/pages/`
2. Add a link to the navigation in `src/layouts/MainLayout.astro`

## License

This project is licensed under the MIT License - see the LICENSE file for details.