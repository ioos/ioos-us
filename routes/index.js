"use strict"
const express = require('express');
const router = express.Router();
const title = 'The U.S. Integrated Ocean Observing System (IOOS) | ';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title.substr(0, title.length - 3)});
});

/* GET region map page. */
router.get('/regions', function(req, res, next) {
  res.render('regions', { title: title + 'Regions Map' });
});

/* GET contact us page. */
router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: title + 'Contact Us' });
});

/* GET comt about page. */
router.get('/comt', function(req, res, next) {
  const projects = require('../public/comt_projects').projects;
  const projectSnippets = [];
  projects.forEach((project) => {
    projectSnippets.push({
      title: project.title,
      overview: project.overview ? project.overview.text.substr(0, 280) : null,
      title_key: project.title_key
    });
  });
  res.render('comt/index', {
    title: title + 'Coastal and Ocean Modeling Testbed Projects',
    projects: projectSnippets });
  });

/* GET comt projects page. */
router.get('/comt/projects/:title_key', function(req, res, next) {
  const projects = require('../public/comt_projects').projects;
  const datasets = require('../public/comt_datasets').datasets;
  const projectTitles = [];
  const projectDatasets = [];
  var project;
  projects.forEach((p) => {
    projectTitles.push({
      title: p.title,
      title_key: p.title_key
    });
    if (p.title_key === req.params.title_key)
        project = {
          id: p.id,
          title: p.title,
          "Project Team": p.team,
          "Project Overview and Results": p.overview,
          "Model Descriptions": p.model_desc,
          "Sub-Project Descriptions/Data": p.sub_project_desc,
          "Publications": p.pubs,
          title_key: p.title_key
        };
  });
  datasets.forEach((dataset) => {
    if (dataset.comt.project === req.params.title_key) {
      projectDatasets.push(dataset);
    }
  });
  res.render('comt/project', {
    title: title + 'Coastal and Ocean Modeling Testbed Projects | ' + project.title,
    data: {
      projectTitles: projectTitles,
      project: project
    },
    title_key: req.params.title_key,
    datasets: projectDatasets,
    path: req.path
  });
});

/* GET comt dataset page. */
router.get('/comt/projects/:title_key/:dataset', function(req, res, next) {
  const datasetTitle = req.params.dataset;
  const projects = require('../public/comt_projects').projects;
  const datasets = require('../public/comt_datasets').datasets;
  var projectTitle = '';

  // Find the first datasset with a matching title.
  const dataset = datasets.find((dataset, index) => {
    return dataset.title.replace(/[^\w]/g, '-').toLowerCase() === datasetTitle;
  });

  if (typeof dataset.variablesColored === "undefined") {
    let variables = require('../public/variables').variables;
    for (let i = 0; i < dataset.variablesMeasured.length; i++) {
      // Find a matching color if there is one defined
      let variableColor = variables.find((colorPair) => {
        return (colorPair[0] === dataset.variablesMeasured[i]) &&
               (colorPair[1] !== '#000000');
      });
      // If there is a matching color set the variable name to the color
      if (variableColor) {
        dataset.variablesMeasured[i] = variableColor;
      }
    }
    dataset.variablesColored = true;
  }
  projects.some((p) => {
    if (p.title_key === req.params.title_key) {
        projectTitle = p.title;
        return true;
    }
  });
  res.render('comt/dataset', {
    title: title + 'Coastal and Ocean Modeling Testbed Projects | ' + projectTitle + ' | Datasets',
    dataset: dataset,
    projectTitle: projectTitle,
    title_key: req.params.title_key,
    subProjectTitle: req.query.t
  });
});

module.exports = router;
