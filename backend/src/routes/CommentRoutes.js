const express = require("express");
const CommentControllers = require("../controllers/CommentControllers");
const router = express.Router();


router.post("/createComment", CommentControllers.createComment);
router.get("/get-comments/:id", CommentControllers.getComments);


module.exports = router;