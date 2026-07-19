const jwt = require("jsonwebtoken");
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");

const verifyToken = (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    try {
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

const verifyAuthorizedToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not allowed" });
    }
  });
};

const verifyAdminToken = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "You are not allowed, only admin allowed" });
    }
  });
};

const verifyPostOwner = (req, res, next) => {
  verifyToken(req, res, async () => {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() === req.user.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not allowed" });
    }
  });
};
const verifyCommentOwner = (req, res, next) => {
  verifyToken(req, res, async () => {
    const comment = await Comment.findById(req.params.id);
    if (comment.user.toString() === req.user.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "You are not allowed" });
    }
  });
};
module.exports = {
  verifyToken,
  verifyAuthorizedToken,
  verifyAdminToken,
  verifyPostOwner,
  verifyCommentOwner,
};
