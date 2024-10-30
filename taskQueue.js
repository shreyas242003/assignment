const taskQueue = {};

module.exports.add = (userId, task) => {
  if (!taskQueue[userId]) taskQueue[userId] = [];

  taskQueue[userId].push(task);
  processQueue(userId);
};

function processQueue(userId) {
  if (!taskQueue[userId] || taskQueue[userId].length === 0) return;

  const task = taskQueue[userId].shift();
  task().then(() => {
    if (taskQueue[userId].length > 0) {
      setTimeout(() => processQueue(userId), 1000); // Process next task after 1-second delay
    }
  });
}
