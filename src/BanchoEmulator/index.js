var router = require('express').Router();
const uuid = require('uuid').v4;
var LoginRequest = require("./Requests/Login");

router.get('/', async(req, res) => {
  res.send("welcome to shiori-dev v0.3 - this is an page served from BanchoEmulator.");
});

router.post('/', async(req, res) => {
  // add checks that only osu! clients can POST here.
  if(req.get('User-Agent') != 'osu!') {
	   res.status(400).send("Unauthorized!");
     return;
  }

  var token = req.get("osu-token") ? req.get("osu-token") : uuid();

  res.setHeader("cho-protocol", "19");
  res.setHeader("cho-token", token);

  // if token is not set perform login
  if(!req.get("osu-token")) {
    LoginRequest({req, res, token});
  } else {

  }

  res.end("", "binary");
});

module.exports = router;
