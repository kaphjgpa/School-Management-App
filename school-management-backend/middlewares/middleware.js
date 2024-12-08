const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and is correctly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach decoded info to request object
    req.userId = decoded.userId;
    next();
  } catch (err) {
    // Handle different JWT errors if needed
    const errorMessage =
      err.name === "TokenExpiredError"
        ? "Unauthorized: Token expired"
        : "Unauthorized: Invalid token";
    return res.status(401).json({ message: errorMessage });
  }
};

// Pagination Middleware
const paginationMiddleware = (req, res, next) => {
  const page = parseInt(req.query.page || 1, 10);
  const limit = parseInt(req.query.limit || 10, 10);

  if (page <= 0 || limit <= 0 || isNaN(page) || isNaN(limit)) {
    return res
      .status(400)
      .json({ message: "Invalid pagination parameters", page, limit });
  }

  req.query.page = page;
  req.query.limit = limit;
  next();
};

module.exports = {
  authMiddleware,
  paginationMiddleware,
};
