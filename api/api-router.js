const express = require('express')

const router = express.Router();

const Projects = require('../data/helpers/projectModel.js')
const Actions = require('../data/helpers/actionModel')

router.use(express.json());

router.get('/', (req, res) => {
  res.status(200).json({ api: 'up' });
});
// Projects
router.get('/projects', (req, res, next) => {
    Projects.get()
      .then(projects => {
        res.status(200).json(projects);
      })
      .catch(error => next(error));
  });

// Actions 
router.get('/actions', (req, res, next) => {
    Actions.get()
      .then(actions => {
        res.status(200).json(actions);
      })
      .catch(error => next(error));
  });
module.exports = router;