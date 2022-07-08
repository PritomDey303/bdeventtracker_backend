const express = require("express");
const { checkLogin } = require("../controller/authController");
const {
  getAllComments,
  postComment,
  deleteComment,
} = require("../controller/commentController");
const router = express.Router();

router.get("/", getAllComments);
router.post("/post", checkLogin, postComment);
router.delete("/delete/:comment_id", checkLogin, deleteComment);
module.exports = router;
