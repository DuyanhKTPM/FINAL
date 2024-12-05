const express = require("express");
const router = express.Router();
const CommentControllers = require("../controllers/CommentControllers");
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');


router.post("/createComment", CommentControllers.createComment);
router.get("/get-comments/:id", CommentControllers.getComments);
router.delete("/delete-comment/:id", authUserMiddleware, CommentControllers.deleteComment);


module.exports = router;