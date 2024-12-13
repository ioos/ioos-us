var express = require('express');
var router = express.Router();
require('dotenv').config();

/* For development, load local .env file */
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').load();
// }

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'IOOS National Glider DAC', GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID });
});

router.get('/benefits', function(req, res, next) {
  res.render('../sites/gliders.ioos.us/views/benefits', {title: 'Benefits', GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID});
});

router.get('/metrics', function(req, res, next) {
  res.render('../sites/gliders.ioos.us/views/metrics', {title: 'metrics', GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID});
});

module.exports = router;
