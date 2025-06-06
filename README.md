# IOOS US 

This repository contains the source code for the IOOS US website and subsites. 

Additionally, the IOOS [Component Library](./component-library/) is found in this repo [here](./component-library/)

## Project Structure

```
.
├── sites/           # Site-specific configurations and assets
├── css/             # Global CSS files
├── js/              # Global JavaScript files
├── images/          # Global images
├── build.js         # Build script
└── assets.json      # Global asset configuration
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   SITE_CONFIG=website_config_to_use
   ```

   `SITE_CONFIG` refers to the directory name to use found in `/sites`
   example: This will run the project for the ioos.us subsite.
   ```
   SITE_CONFIG=ioos.us
   ```

## Development

The project includes several npm scripts for development:

- `npm run dev`: Starts the development server with hot-reloading
- `npm run start`: Builds the project and serves it with live reload
- `npm run serve`: Serves the static files with browser-sync
- `npm run build`: Builds the project once

To start development:

```bash
npm run start
```

This will:
- Watch for changes in project files
- Automatically rebuild and reload when changes are detected
- Serve the site locally at http://localhost:3000

## Project Configuration

### Site Configuration

Each site has its own configuration in the `sites/` directory. The site configuration includes:
- Site-specific assets
- Routes
- Templates
- Images and other resources

### Asset Management

Assets are managed through `assets.json` files:
- Global assets are defined in the root `assets.json`
- Site-specific assets are defined in `sites/[site-name]/assets.json`

### Templates

The project uses Pug templates located in the `views/` directory. Templates can access:
- Site configuration
- Global and site-specific assets
- Environment variables

###
To create a new subsite, create a new folder under /sites
`/sites/example.template` can be used as reference/scaffolding