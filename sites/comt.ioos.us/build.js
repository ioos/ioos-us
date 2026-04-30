const path = require('path');
const fs = require('fs-extra');

const TITLE_BASE = 'The U.S. Integrated Ocean Observing System (IOOS) | ';

/**
 * Load the three JSON data files used across all COMT pages.
 */
function loadData(siteDir) {
  const projectsData = JSON.parse(fs.readFileSync(path.join(siteDir, 'data/comt_projects.json'), 'utf-8'));
  const datasetsData = JSON.parse(fs.readFileSync(path.join(siteDir, 'data/comt_datasets.json'), 'utf-8'));
  const variablesData = JSON.parse(fs.readFileSync(path.join(siteDir, 'data/variables.json'), 'utf-8'));
  return {
    projects: projectsData.projects,
    datasets: datasetsData.datasets,
    variables: variablesData.variables
  };
}

/**
 * Build project snippets for the index page (truncated overview text).
 */
function buildProjectSnippets(projects) {
  return projects.map((project) => ({
    title: project.title,
    overview: project.overview ? project.overview.text.substr(0, 280) : null,
    title_key: project.title_key
  }));
}

/**
 * Build the template data for a single project page.
 */
function buildProjectPageData(projects, datasets, titleKey) {
  const projectTitles = [];
  let project;

  projects.forEach((p) => {
    projectTitles.push({ title: p.title, title_key: p.title_key });
    if (p.title_key === titleKey) {
      project = {
        id: p.id,
        title: p.title,
        "Project Team": p.team,
        "Project Overview and Results": p.overview,
        "Model Descriptions": p.model_desc,
        "Sub-Project Descriptions/Data": p.sub_project_desc,
        "Publications": p.pubs,
        "Resources": p.resources,
        title_key: p.title_key
      };
    }
  });

  const projectDatasets = datasets.filter((d) => d.comt.project === titleKey);

  return { project, projectTitles, projectDatasets };
}

/**
 * Apply variable color mapping to a dataset (returns a copy).
 */
function applyVariableColors(dataset, variables) {
  const copy = JSON.parse(JSON.stringify(dataset));
  for (let i = 0; i < copy.variablesMeasured.length; i++) {
    const match = variables.find((pair) =>
      pair[0] === copy.variablesMeasured[i] && pair[1] !== '#000000'
    );
    if (match) {
      copy.variablesMeasured[i] = match;
    }
  }
  return copy;
}

/**
 * Returns extra template locals for the index route.
 * Called by build.js before rendering the index page.
 */
function getIndexData({ siteDir }) {
  const { projects } = loadData(siteDir);
  return { projects: buildProjectSnippets(projects) };
}

/**
 * Generates all data-driven pages (projects + datasets).
 * Called by build.js after the static routes are compiled.
 */
function compileDataRoutes({ pug, siteConfig, siteSubdirectory, siteDir, assets, siteAssets, outputDir }) {
  const dataRoutes = siteAssets.main.dataRoutes;
  if (!dataRoutes || dataRoutes.length === 0) return;

  const { projects, datasets, variables } = loadData(siteDir);
  const rootDir = path.resolve(siteDir, '..', '..');

  dataRoutes.forEach((routeDef) => {
    const template = path.join(rootDir, routeDef.template);

    if (routeDef.pattern === 'projects/:title_key') {
      console.log(`Generating project pages for ${projects.length} projects...`);

      projects.forEach((p) => {
        const { project, projectTitles, projectDatasets } = buildProjectPageData(projects, datasets, p.title_key);
        if (!project) {
          console.error(`Project not found for title_key: ${p.title_key}`);
          return;
        }

        const outPath = path.join(outputDir, `projects/${p.title_key}/index.html`);
        try {
          const html = pug.renderFile(template, {
            siteConfig,
            siteSubdirectory,
            assets,
            env: process.env.NODE_ENV || 'production',
            title: TITLE_BASE + 'Coastal and Ocean Modeling Testbed Projects | ' + project.title,
            data: { projectTitles, project },
            title_key: p.title_key,
            datasets: projectDatasets,
            pagePath: `/projects/${p.title_key}`
          });
          fs.outputFileSync(outPath, html);
          console.log(`Generated: ${outPath}`);
        } catch (err) {
          console.error(`Error rendering project page for ${p.title_key}:`, err);
        }
      });

    } else if (routeDef.pattern === 'projects/:title_key/:dataset') {
      console.log(`Generating dataset pages for ${datasets.length} datasets...`);

      datasets.forEach((dataset) => {
        const slug = dataset.title.replace(/[^\w]/g, '-').toLowerCase();
        const titleKey = dataset.comt.project;

        let projectTitle = '';
        projects.some((p) => {
          if (p.title_key === titleKey) { projectTitle = p.title; return true; }
        });

        const prepared = applyVariableColors(dataset, variables);
        const outPath = path.join(outputDir, `projects/${titleKey}/${slug}/index.html`);

        try {
          const html = pug.renderFile(template, {
            siteConfig,
            siteSubdirectory,
            assets,
            env: process.env.NODE_ENV || 'production',
            title: TITLE_BASE + 'Coastal and Ocean Modeling Testbed Projects | ' + projectTitle + ' | Datasets',
            dataset: prepared,
            projectTitle,
            title_key: titleKey,
            subProjectTitle: dataset.comt['sub-project'] || ''
          });
          fs.outputFileSync(outPath, html);
          console.log(`Generated: ${outPath}`);
        } catch (err) {
          console.error(`Error rendering dataset page for ${dataset.title} (${slug}):`, err);
        }
      });
    }
  });
}

module.exports = { getIndexData, compileDataRoutes };
