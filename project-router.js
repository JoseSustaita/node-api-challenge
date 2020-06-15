const express = require("express");

const router = express.Router();

const projectM = require("./data/helpers/projectModel");
router.use("/:id", validateId);

//GET

router.get("/:id", (req, res) => {
  projectM
    .get(req.params.id)
    .then((project) => {
      res.status(200).json(project);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Message: "Something went Wrong!",
      });
    });
});

router.get("/", (req, res) => {
  projectM
    .get()
    .then((project) => {
      res.status(200).json({ project });
    })
    .catch((err) => {
      res.status(500).json({ Message: "Something went wrong!" });
    });
});

router.get("/:id/actions", (req, res) => {
  projectM
    .getProjectActions(req.params.id)
    .then((action) => {
      res.status(200).json(action);
    })
    .catch((err) => {
      res.status(500).json({
        Message: "Could not find your action",
      });
    });
});

//POST

router.post("/", (req, res) => {
  projectM
    .get()
    .then((project) => {
      if (!req.body.name || !req.body.description || req.body.completed) {
        res.status(400).json({
          Message: "missing name and description!",
        });
      } else {
        projectM
          .insert(req.body)
          .then((project) => {
            res.status(201).json(project);
          })
          .catch((err) => {
            res.status(500).json({
              Message: "failed to complete post",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ Message: "Something went wrong!" });
    });
});

//PUT
router.put("/:id", (req, res) => {
  projectM
    .get(req.params.id)
    .then((project) => {
      if (project.length === 0) {
        res.status(404).json({
          Message: "Update post failed",
        });
      } else if (
        !req.body.name ||
        !req.body.description ||
        req.body.completed
      ) {
        res.status(400).json({
          Message: "missing name or description field",
        });
      } else {
        projectM
          .update(req.params.id, req.body)
          .then((project) => {
            res.status(201).json(req.body);
          })
          .catch((err) => {
            res.status(500).json({
              Message: "failed to complete post",
            });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ Message: "Sorry, something went wrong" });
    });
});

//DELETE

router.delete("/:id", (req, res) => {
  projectM.remove(req.params.id).then((project) => {
    res.status(200).json({
      message: "Project has been deleted",
      project: req.project,
    });
  });
});

function validateId(req, res, next) {
  const id = req.params.id;
  projectM
    .get(id)
    .then((project) => {
      if (!project) {
        res.status(400).json({
          Message: "The project does not exist",
        });
      } else {
        req.project = project;
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Message: "could not validate",
      });
    });
}

module.exports = router;
