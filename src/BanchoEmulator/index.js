var router = require('express').Router();
const uuid = require('uuid').v4;
var LoginRequest = require("./Requests/Login");
var TokenManager = require("../TokenManager");
const Packets = require('../BanchoEmulator/Packets');
const PacketHandler = require("./PacketHandler");
var CallHook = require("../PluginManager").CallHook;
const VersionInfo = require('../Shiori/VersionInfo');

router.get('/', async(req, res) => {
  res.send(`welcome to shiori ${VersionInfo.formatted} - this is an page served from BanchoEmulator.`);
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
    if(TokenManager.GetToken(token) == null || TokenManager.GetToken(token).user == null) {
      if(TokenManager.GetToken(token) != null) {
        CallHook("onUserDisconnection", t.user);
        TokenManager.DestroyToken(token);
      }
      res.write(Packets.ServerRestart(1500));
    } else {
      PacketHandler({req, res, token});
    }
  }

  if((q = TokenManager.GetToken(token)) != null) {
    q.queue.forEach((p, i) => {
      res.write(p);
      delete q.queue[i];
    });
    q.queue = q.queue.filter(d => d != undefined);
    q.resetTimeout();
  }

  res.end("", "binary");
});

module.exports = router;
