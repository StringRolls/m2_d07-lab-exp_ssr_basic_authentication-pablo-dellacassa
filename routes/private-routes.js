const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
  res.render("private/profile", { user: req.session.currentUser });
});

module.exports = router;
