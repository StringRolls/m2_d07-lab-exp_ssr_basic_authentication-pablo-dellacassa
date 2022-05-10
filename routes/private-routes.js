const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
  res.render("users/user-profile", { user: req.session.currentUser });
});

module.exports = router;