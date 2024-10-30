const rateLimits = {};
const RATE_LIMIT = 20; // Max 20 tasks per minute per user
const TIME_FRAME = 60 * 1000; // 1 minute in milliseconds
const TASK_INTERVAL = 1000; // 1 second between tasks per user

module.exports = (req, res, next) => {
  const userId = req.body.userId;
  const currentTime = Date.now();

  if (!rateLimits[userId]) {
    rateLimits[userId] = { count: 0, lastTaskTime: 0 };
  }

  const userRate = rateLimits[userId];
  if (
    currentTime - userRate.lastTaskTime < TASK_INTERVAL ||
    userRate.count >= RATE_LIMIT
  ) {
    return res
      .status(429)
      .json({ message: "Rate limit exceeded, task will be queued." });
  }

  userRate.count++;
  userRate.lastTaskTime = currentTime;
  userRate.count = Math.max(userRate.count - 1, 0);
  next();
};
