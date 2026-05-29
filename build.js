const pug = require('pug');
const fs = require('fs-extra');
const path = require('path');
const uglifyJS = require('uglify-js');
const CleanCSS = require('clean-css');
require('dotenv').config();

// Ensure required environment variables are loaded
function loadSiteConfig() {
  const SITE_CONFIG = process.env.SITE_CONFIG;
  if (!SITE_CONFIG) {
    console.error('Error: Missing required environment variable SITE_CONFIG.');
    process.exit(1);
  }
  return SITE_CONFIG;
}

// Load assets JSON directly
function loadAssets(site) {
  try {
    // Determine the path to the assets.json file
    const assetsPath = site
      ? path.join(__dirname, `sites/${site}/assets.json`)
      : path.join(__dirname, 'assets.json');

    // Read and parse the JSON file
    const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf-8'));
    console.log(`Loaded assets from ${assetsPath}`);
    return assets;
  } catch (err) {
    console.error(`Error loading assets for site: ${site || 'main'}`, err);
    process.exit(1);
  }
}

// Compile Pug templates to HTML
function compilePugTemplates(siteConfig, siteSubdirectory, assets, siteAssets, extraIndexData) {
  const viewsDir = path.join(__dirname, 'views');
  const outputDir = path.join(__dirname, 'static');

  const routes = Object.keys(siteAssets.main.routes);

  // Ensure the output directory exists
  fs.ensureDirSync(outputDir);

  routes.forEach((route) => {
    const template = route === '/' 
      ? path.join(viewsDir, 'index.pug')
      : path.join(__dirname, siteAssets.main.routes[route].template);

    const outputPath = path.join(outputDir, route === 'index' ? 'index.html' : `${route}/index.html`);

    // Merge any extra data for the index route (e.g., data-driven content)
    const extra = (route === 'index' && extraIndexData) ? extraIndexData : {};

    try {
      const html = pug.renderFile(template, {
        siteConfig: siteConfig,
        siteSubdirectory: siteSubdirectory,
        assets,
        env: process.env.NODE_ENV || 'production',
        title: siteAssets.main.routes[route].title ?? siteAssets.main.routes['index'].title,
        ...extra
      });
      fs.outputFileSync(outputPath, html);
      console.log(`Generated: ${outputPath}`);
    } catch (err) {
      console.error(`Error rendering ${template} for route ${route}:`, err);
    }
  });
}

// Compile JavaScript files into a single output file
function compileJavaScript(assetPath, jsFiles) {
  let combinedContent = '';

  jsFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      combinedContent += `\n// File: ${file}\n${content}`;
    } catch (err) {
      console.error(`Error reading JavaScript file: ${file}`, err);
    }
  });

  try {
    const minified = uglifyJS.minify(combinedContent);
    if (minified.error) {
      console.error('Error during JavaScript minification:', minified.error);
      return;
    }
    fs.outputFileSync(assetPath, minified.code);
    console.log(`Compiled and minified JavaScript written to: ${assetPath}`);
  } catch (err) {
    console.error(`Error writing compiled JavaScript to ${assetPath}:`, err);
  }
}

// Compile CSS files into a single output file
function compileCSS(assetPath, cssFiles) {
  let combinedContent = '';

  cssFiles.forEach((file) => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      combinedContent += `\n/* File: ${file} */\n${content}`;
    } catch (err) {
      console.error(`Error reading CSS file: ${file}`, err);
    }
  });

  try {
    const minified = new CleanCSS().minify(combinedContent);
    if (minified.errors && minified.errors.length > 0) {
      console.error('Error during CSS minification:', minified.errors);
      return;
    }
    fs.outputFileSync(assetPath, minified.styles);
    console.log(`Compiled and minified CSS written to: ${assetPath}`);
  } catch (err) {
    console.error(`Error writing compiled CSS to ${assetPath}:`, err);
  }
}

// Helper to combine asset lists
function combineAssets(globalAssets, siteAssets) {
  return globalAssets.concat(siteAssets || []);
}

// Copy images from source to destination
function copyDirectory(source, destination) {
  try {
    // Check if the source directory exists
    if (!fs.existsSync(source)) {
      console.debug(`Skipping copy: Source directory /${source.split('/')[source.split('/').length-1]} does not exist.`);
      return;
    }

    // Use fs-extra to efficiently copy the directory
    fs.copySync(source, destination, { overwrite: true });
    console.log(`Copied from ${source}`);
  } catch (err) {
    console.error(`Error copying from ${source} to ${destination}:`, err);
  }
}

// Load an optional site-specific build module (e.g., sites/comt.ioos.us/build.js)
function loadSiteBuildModule(siteConfig) {
  const modulePath = path.join(__dirname, `sites/${siteConfig}/build.js`);
  try {
    if (fs.existsSync(modulePath)) {
      return require(modulePath);
    }
  } catch (err) {
    console.error(`Error loading site build module for ${siteConfig}:`, err);
  }
  return null;
}

// Main build process
function build() {
  const SITE_CONFIG = loadSiteConfig();
  const SITE_SUBDIRECTORY = process.env.SITE_SUBDIRECTORY

  const assets = loadAssets();
  const siteAssets = loadAssets(SITE_CONFIG)

  console.log('Starting build process...');

  const sourcePath = path.join(__dirname, `sites/${SITE_CONFIG}`);
  const outputDir = path.join(__dirname, 'static');

  // Check for a site-specific build module
  const siteBuild = loadSiteBuildModule(SITE_CONFIG);
  const buildContext = {
    pug, fs, path,
    siteConfig: SITE_CONFIG,
    siteSubdirectory: SITE_SUBDIRECTORY,
    siteDir: sourcePath,
    assets,
    siteAssets,
    outputDir
  };

  // If the site provides getIndexData, merge that into the initial template render
  let extraIndexData = {};
  if (siteBuild && typeof siteBuild.getIndexData === 'function') {
    extraIndexData = siteBuild.getIndexData(buildContext);
  }

  // Compile Pug templates for static routes
  compilePugTemplates(SITE_CONFIG, SITE_SUBDIRECTORY, assets, siteAssets, extraIndexData);

  // If the site provides compileDataRoutes, call it for data-driven pages
  if (siteBuild && typeof siteBuild.compileDataRoutes === 'function') {
    siteBuild.compileDataRoutes(buildContext);
  }

  // Combine and compile JavaScript
  const jsOutputPath = `static/js/main.min.js`;
  const jsFiles = combineAssets(assets.main.js, siteAssets.main.js);
  compileJavaScript(jsOutputPath, jsFiles);

  // Combine and compile CSS
  const cssOutputPath = `static/css/main.min.css`;
  const cssFiles = combineAssets(assets.main.css, siteAssets.main.css);
  compileCSS(cssOutputPath, cssFiles);

  copyDirectory(`images`, `${outputDir}/images`);
  copyDirectory(`fonts`, `${outputDir}/fonts`);
  copyDirectory(`css/roboto-slab.css`, `${outputDir}/css/roboto-slab.css`);
  copyDirectory(`${sourcePath}/images`, `${outputDir}/images`);
  copyDirectory(`${sourcePath}/css/fonts`, `${outputDir}/fonts`);
  copyDirectory(`${sourcePath}/docs`, `${outputDir}/docs`);

  console.log('Build process complete.');
}

// Start the build process
build();
