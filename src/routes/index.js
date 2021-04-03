const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    return res.json({ok: "Hello world!"});
});

module.exports = router;
