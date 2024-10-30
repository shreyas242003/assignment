const cluster = require("cluster");
const os = require("os");
const express = require("express");
const bodyParser = require("body-parser");
const rateLimiter = require("./rateLimiter"); // Rate limiting middleware
const taskQueue = require("./taskQueue"); // Task queue system
const taskLogger = require("./taskLogger"); // Task logging function

const cpuCount = 2; // Define the number of worker processes

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers based on CPU count (two replicas in this case)
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died, starting a new one...`);
    cluster.fork(); // Restart worker if it dies
  });
} else {
  const app = express();
  app.use(bodyParser.json());

  // Define the route with rate limiting and task queuing
  app.post("/task", rateLimiter, async (req, res) => {
    const userId = req.body.userId;

    // Queue the task if rate limit is exceeded
    await taskQueue.add(userId, async () => {
      await taskLogger(userId);
    });

    res.json({
      message: `Task has been queued or processed for user: ${userId}`,
    });
  });

  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} listening on port ${PORT}`);
  });
}
