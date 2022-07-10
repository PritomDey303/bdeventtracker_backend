const express = require("express");
const { checkLogin } = require("../controller/authController");
const {
  getAllComments,
  postComment,
  deleteComment,
} = require("../controller/commentController");
const router = express.Router();

router.get("/:event_id", getAllComments);
router.post("/post/:event_id", checkLogin, postComment);
router.delete("/delete", checkLogin, deleteComment);
module.exports = router;
