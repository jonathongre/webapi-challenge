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

router.post('/projects', (req, res, next) => {
    Projects.insert(req.body)
        .then(projects => {
        res.status(200).json(projects);
        })
        .catch(error => next(error));
    });

router.put('/projects/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    Projects.update(id, changes)
        .then(updated => {
        res.status(200).json(updated);
        })
        .catch(error => {
        res.status(500).json(error);
        });
    });
    
router.delete('/projects/:id', (req, res) => {
    const { id } = req.params;
    
    Projects.remove(id)
        .then(deleted => {
        res.status(200).json({ message: `Project with ID ${id} was deleted` });
        })
        .catch(error => {
        res.status(500).json(error);
        });
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