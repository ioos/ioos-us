"use strict"
const express = require('express');
const router = express.Router();
const title = 'The U.S. Integrated Ocean Observing System (IOOS) | ';
const path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title.substr(0, title.length - 3)});
});

/* GET region map page. */
router.get('/regions', function(req, res, next) {
  res.render('regions', { title: title + 'Regions Map' });
});

/* GET surf cam page. */
router.get('/surf-cam', function(req, res, next) {
  res.render('surf-cam', { title: title + 'Live Surf Camera' });
});

/* Redirect to the comt.ioos.us */
router.get('/comt', function(req, res, next) {
  res.redirect(301, 'https://comt.ioos.us');
});

/* GET comt model viewer redirect. */
router.get('/comt/model_viewer', function(req, res, next) {
  res.writeHead(301,
    {Location: 'http://oceansmap.com/comt/'}
  );
  res.end();
});

module.exports = router;
