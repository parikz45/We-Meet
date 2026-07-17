const jwt = require("jsonwebtoken");

// Verifies the Bearer token and attaches the decoded payload to req.user.
// Downstream handlers should use req.user.id as the authenticated user id
// and must NOT trust any userId sent in the request body.
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("You are not authenticated");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }
    req.user = payload;
    next();
  });
};

module.exports = verifyToken;
