const express = require("express");
const { checkLogin } = require("../controller/authController");
const {
  getAllReplies,
  postReply,
  deleteReply,
} = require("../controller/replyController");
const router = express.Router();

router.get("/:comment_id", getAllReplies);
router.post("/post/:comment_id", checkLogin, postReply);
router.delete("/delete/:reply_id", checkLogin, deleteReply);
module.exports = router;
