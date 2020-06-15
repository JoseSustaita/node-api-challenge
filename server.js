const express = require("express");
const actionsRouter = require("./actions-router");
const projectsRouter = require("./project-router");
const server = express();

server.use(express.json());
server.use("/actions", actionsRouter);
server.use("/projects", projectsRouter);

module.exports = server;
