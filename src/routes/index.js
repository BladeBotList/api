const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    return res.json({ok: "Hello world!"});
});

router.use("/bots", require("./bots"))
router.use("/search", require("./search"))
module.exports = router;
