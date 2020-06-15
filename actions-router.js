const express = require("express");

const actionM = require("./data//helpers/actionModel");

const router = express.Router();

router.use("/:id", validateId);

//GET

router.get("/", (req, res) => {
  res.status(200).json("there is no actions without an id");
});

router.get("/:id", (req, res) => {
  actionM
    .get(req.params.id)
    .then((action) => {
      res.status(200).json(req.action);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ Message: "there is no action with this id" });
    });
});

//POST

router.post("/", (req, res) => {
  actionM
    .get()
    .then((action) => {
      if (!req.body.project_id || !req.body.description || req.body.completed) {
        res.status(400).json({
          Message: "missing a field check the description key",
        });
      } else {
        actionM
          .insert(req.body)
          .then((action) => {
            res.status(201).json(action);
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
  actionM
    .get(req.params.id)
    .then((action) => {
      if (action.length === 0) {
        res.status(404).json({
          Message: "could not make post",
        });
      } else if (
        !req.body.project_id ||
        !req.body.description ||
        !req.body.completed
      ) {
        res.status(400).json({
          Message: "missing a field",
        });
      } else {
        actionM
          .update(req.params.id, req.body)
          .then((action) => {
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
      res.status(500).json({ Message: "Something went wrong" });
    });
});

//Delete

router.delete("/:id", (req, res) => {
  actionM.remove(req.params.id).then((action) => {
    res
      .status(200)
      .json({ message: "project has been deleted", project: req.action });
  });
});

function validateId(req, res, next) {
  const id = req.params.id;
  actionM
    .get(id)
    .then((action) => {
      if (!action) {
        res.status(400).json({
          Message: "The action doesnt exist",
        });
      } else {
        req.action = action;
        next();
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        Message: " can not validate",
      });
    });
}

module.exports = router;
