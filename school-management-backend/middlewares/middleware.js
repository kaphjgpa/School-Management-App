const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({});
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(403).json({});
  }
};

const paginationMiddleware = (req, res, next) => {
  req.query.page = parseInt(req.query.page || 1);
  req.query.limit = parseInt(req.query.limit || 10);

  if (req.query.page <= 0 || req.query.limit <= 0) {
    return res.status(400).json({ message: "Invalid pagination parameters" });
  }

  next();
};

module.exports = {
  authMiddleware,
  paginationMiddleware,
};
