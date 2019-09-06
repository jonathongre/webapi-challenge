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

router.get('/projects/:id', (req, res, next) => {
    const { id } = req.params

    Projects.get(id)
        .then(projects => {
        res.status(200).json(projects);
        })
        .catch(error => next(error));
    });

router.get('/projects/:id/actions', (req, res, next) => {
    const { id } = req.params
    
    Projects.getProjectActions(id)
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

router.get('/actions/:id', (req, res, next) => {
    const { id } = req.params

    Actions.get(id)
        .then(actions => {
        res.status(200).json(actions);
        })
        .catch(error => next(error));
    });

router.post('/projects/:project_id/actions', (req, res) => {
    const { project_id } = req.params;
    const newAction = {
        project_id: project_id,
        description: req.body.description || null,
        notes: req.body.notes || null,
        completed: req.body.completed || null
        }
        Projects.get(project_id)
        .then(project => {
            if(project){
                if (newAction.description && newAction.notes) {
                    Actions.insert(newAction)
                    .then(response => {
                        console.log(response);
                        res.status(201).json({ message: "Action created successfully" });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "Server error inserting new action" })
                    })
                } else {
                    res.status(400).json({ error: "Description and Notes required" })
                }
            } else {
                res.status(404).json({ error: "Project with the given id not found." })
            }
        })
    });

router.put('/projects/:project_id/actions/:id', (req, res) => {
    const { project_id, id } = req.params;
    const newAction = {
        project_id: project_id,
        description: req.body.description || null,
        notes: req.body.notes || null,
        completed: req.body.completed || null
        }
        Actions.get(id)
        .then(action => {
            if(action){
                Projects.get(project_id)
                .then(project => {
                    if(project){
                        if (newAction.description && newAction.notes) {
                            Actions.update(id, newAction)
                            .then(response => {
                                console.log(response);
                                res.status(201).json({ message: "Action updated successfully" });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({ error: "Server error updating action" })
                            })
                        } else {
                            res.status(400).json({ error: "Description and Notes required" })
                        }
                    } else {
                        res.status(404).json({ error: "Project with the given id not found." })
                    }
                })
            } else {
                res.status(404).json({ error: "Action with the given id not found."})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "Server error getting action with the given id" })
        })
    })
    
router.delete('/projects/:project_id/actions/:id', (req, res) => {
    const { id } = req.params;
    Actions.get(id)
        .then(action => {
            if(action){
                Actions.remove(id)
                .then(response => {
                    res.status(200).json({ message: "Action successfully deleted" })
                })
                .catch(error => {
                    res.status(500).json({ error: "Server error deleting the action" })
                })
            } else {
                res.status(404).json({ error: "Action with the given id not found." })
            }
        })
        .catch(error => {
            res.status(500).json({ error: "Server error validating action id." })
        })
    })

module.exports = router;