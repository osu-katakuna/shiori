var router = require('express').Router();

router.get('/', async(req, res) => {
  res.send("welcome to shiori-dev v0.2 - this is an page served from BanchoEmulator.");
});

module.exports = router;
