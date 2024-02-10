const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/posts", require("./posts"));
router.use("/inform", require("./inform"));
router.use("/upload", require("./upload"));
router.use("/users", require("./users"));

module.exports = router;
