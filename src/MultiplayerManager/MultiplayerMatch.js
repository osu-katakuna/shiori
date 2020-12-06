const Token = require('../TokenManager/Token');

const MultiplayerSlotStatus = {
  Free: 1,
  Locked: 2,
  NotReady: 4,
  Ready: 8,
  NoBeatmap: 16,
  Playing: 32,
  Occupied: 124,
  PlayingQuit: 128
};

const TeamMode = {
  HeadToHead: 0,
  TagCoop: 1,
  TeamVs: 2,
  TagTeamVs: 3
};

const WinCondition = {
  Score: 0,
  Accuracy: 1,
  Combo: 2
};

class MultiplayerSlot {
  constructor(slot, player = null, status = MultiplayerSlotStatus.Free) {
    this.slot = slot;
    this.player = player;
    this.status = status;
    this.team = 0;
    this.mods = 0;

    this.loadedMap = false;
    this.requestedSkip = false;
    this.score = null;
  }
}

class MultiplayerMatchResult {
  constructor(match = null, results = []) {
    if(!(match instanceof MultiplayerMatch)) {
      throw new Error("match must be an instance of MultiplayerMatch"); // these stupid checks are required!! we don't want misuses please!
    }
    this.match = match;
    this.results = results;
  }
}

class MultiplayerMatch {
  constructor(name, host, password = null, maxPlayers = 8, publicHistory = false) {
    if(!(host instanceof Token)) {
      throw new Error("host must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    this.id = 0;

    this.name = name;
    this.host = host;
    this.password = password;
    this.maxSlots = maxPlayers;

    this.slots = [];

    this.freeMod = false;
    this.mods = 0;
    this.teamMode = TeamMode.HeadToHead;
    this.winCondition = WinCondition.Score;

    this.gameMode = 0;

    this.beatmap = {
      name: null,
      hash: null,
      id: -1
    };

    this.seed = 0;
    this.playing = false;

    for(var i = 0; i < 16; i++) {
      this.slots.push(new MultiplayerSlot(i, null, i < maxPlayers ? MultiplayerSlotStatus.Free : MultiplayerSlotStatus.Locked));
    }
  }

  join(player) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    const allocatedSlot = this.slots.filter(s => s.status == MultiplayerSlotStatus.Free)[0];
    if(allocatedSlot == null) {
      player.NotifyFailJoinMP();
      return;
    }

    allocatedSlot.player = player;
    allocatedSlot.status = MultiplayerSlotStatus.NotReady

    player.inMatch = true;
    player.matchID = this.id;
    player.NotifyJoinedMPLobby(this); // notify the player we joined the lobby

    this.update();
  }

  setMods(player, mods) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    if(!this.freeMod) {
      player === this.host && (this.mods = mods);
      return;
    }

    // remove DT, NC and HT mods because this is an advantage to players!!

    const DoubleTimeMod = 1 << 6;
    const HalfTimeMod = 1 << 8;
    const NightcoreMod = 1 << 9;

    mods & DoubleTimeMod && (mods ^= DoubleTimeMod);
    mods & HalfTimeMod && (mods ^= HalfTimeMod);
    mods & NightcoreMod && (mods ^= NightcoreMod);

    // good

    const players = this.slots.filter(slot => slot.player === player);

    if(players.length == 1) {
      players[0].mods = mods;
      this.update();
    }
  }

  setPlayerReadyState(player, ready = false) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }
    const players = this.slots.filter(slot => slot.player === player);

    if(players.length == 1) {
      players[0].status = ready ? MultiplayerSlotStatus.Ready : MultiplayerSlotStatus.NotReady;
      this.update();
    }
  }

  setPlayerMissingMap(player, missing = true) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }
    const players = this.slots.filter(slot => slot.player === player);

    if(players.length == 1) {
      players[0].status = missing ? MultiplayerSlotStatus.NoBeatmap : MultiplayerSlotStatus.NotReady;
      this.update();
    }
  }

  start() {
    const readyPlayers = this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Ready);

    if(readyPlayers.length == this.slots.filter(s => s.status & 124).length) {
      // everyone is ready!
      readyPlayers.forEach(slot => {
        slot.status = MultiplayerSlotStatus.Playing;
        slot.loadedMap = false;
        slot.requestedSkip = false;
        slot.score = null;
      });

      this.update();
      this.slots.forEach(slot => {
        slot.status & 124 && slot.player.NotifyMPMatchStarting(this);
      });
    }
  }

  skip(player) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    // set our skip state
    const allPlayers = this.slots.filter(slot => slot.player === player);

    allPlayers.length == 1 && (allPlayers[0].requestedSkip = true);

    const players = this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing);
    const skippedPlayers = this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing && slot.requestedSkip);

    skippedPlayers.length == players.length && skippedPlayers.forEach(slot => slot.player.NotifyMPSkip());

    this.update();
  }

  finished(player) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    const RunEvent = require('../PluginManager').CallHook;

    // set our finish state
    const allPlayers = this.slots.filter(slot => slot.player === player);

    allPlayers.length == 1 && (allPlayers[0].finished = true);

    const players = this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing);
    const finishedPlayers = this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing && slot.finished);

    if(finishedPlayers.length == players.length) {
      finishedPlayers.forEach(slot => {
        slot.status = MultiplayerSlotStatus.NotReady;
        slot.loadedMap = false;
        slot.requestedSkip = false;
      });
      finishedPlayers.forEach(slot => slot.player.NotifyMPComplete());
      RunEvent("onMPMatchComplete", new MultiplayerMatchResult(this, finishedPlayers.map(x => ({
        score: x.score,
        player: x.player
      }))));
    }

    this.update();
  }

  playerScoreUpdate(player, score) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }
    const players = this.slots.filter(slot => slot.player === player);

    if(players.length == 1) {
      score.id = players[0].slot;
      players[0].score = score;
      this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing).forEach(slot => slot.player.NotifyMPPlayerScoreUpdate(score));
      this.update();
    }
  }

  playerFailed(player) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }
    const players = this.slots.filter(slot => slot.player === player);

    if(players.length == 1) {
      this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing).forEach(slot => slot.player.NotifyMPPlayerFailed(players[0].slot));
      this.update();
    }
  }

  playerChangeSlot(player, newSlot) {
    if(!(player instanceof Token)) throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    const players = this.slots.filter(slot => slot.player === player);

    // check if the new slot number is between 0 and 16
    if(newSlot < 0 || newSlot > 16) {
      return;
    }

    if(players.length == 1) {
      // check if the slot is occupied
      if(this.slots.filter(slot => slot.status != MultiplayerSlotStatus.Free && slot.slot == newSlot).length > 0) {
        return;
      }

      const _slot = this.getSlot(newSlot);

      _slot.player = players[0].player;
      _slot.status = players[0].status;
      _slot.team = players[0].team;
      _slot.mods = players[0].mods;

      players[0].player = null;
      players[0].status = MultiplayerSlotStatus.Free;
      players[0].team = 0;
      players[0].mods = 0;

      this.update();
    }
  }

  toggleSlotLock(slot) {
    // check if the new slot number is between 0 and 16
    if(slot < 0 || slot > 16) {
      return;
    }

    const selectedSlot = this.getSlot(slot);

    if(selectedSlot.status & 124) {
      // kick player in that slot!
      selectedSlot.player.NotifyMPKick();
      const kickedPlayer = selectedSlot.player;

      selectedSlot.player = null;
      selectedSlot.status = MultiplayerSlotStatus.Locked;
      selectedSlot.team = 0;
      selectedSlot.mods = 0;

      kickedPlayer.NotifyMPLobby(this);
    } else {
      this.maxSlots += selectedSlot.status == MultiplayerSlotStatus.Free ? -1 : 1;
      selectedSlot.status = selectedSlot.status == MultiplayerSlotStatus.Free ? MultiplayerSlotStatus.Locked : MultiplayerSlotStatus.Free;
    }

    this.update();
  }

  playerMapLoaded(player) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    // set our loaded state
    const allPlayers = this.slots.filter(slot => slot.player === player);

    allPlayers.length == 1 && (allPlayers[0].loadedMap = true);

    const players = this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing);
    const readyPlayers = this.slots.filter(slot => slot.status == MultiplayerSlotStatus.Playing && slot.loadedMap);

    if(readyPlayers.length == players.length) {
      this.playing = true;
      readyPlayers.forEach(slot => slot.player.NotifyMPMatchStarted());
    }

    this.update();
  }

  playerToggleTeam(player) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }
    const players = this.slots.filter(slot => slot.player === player);

    if(players.length == 1) {
      players[0].team = players[0].team == 0 ? 1 : 0; // very professional way yes
      this.update();
    }
  }

  setHost(newHost) {
    if(!(newHost instanceof Token)) {
      throw new Error("newHost must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    this.host = newHost;
    newHost.NotifyMPHost();

    this.update();
  }

  leave(player) {
    if(!(player instanceof Token)) {
      throw new Error("player must be an instance of Token"); // these stupid checks are required!! we don't want misuses please!
    }

    const players = this.slots.filter(slot => slot.player === player);

    if(players.length == 0) {
      return;
    }

    players[0].player = null;
    players[0].status = MultiplayerSlotStatus.Free;
    players[0].team = 0;
    players[0].mods = 0;

    player.inMatch = false;
    player.matchID = -1;

    if(player === this.host) {
      for(var i = 0; i < 16; i++) {
        if(this.getSlot(i).status & 124) {
          this.setHost(this.getSlot(i).player);
          break;
        }
      }
    }

    this.update();
  }

  update() {
    const MultiplayerManager = require('./index');
    const RunEvent = require('../PluginManager').CallHook;

    this.slots.forEach(slot => { slot.status & 124 && slot.player.NotifyMPLobby(this); });
    MultiplayerManager.MatchUpdate(this);
    RunEvent("onMPMatchUpdate", this);
  }

  getSlot(slot) {
    if(slot > 16) {
      return null;
    }

    if(this.slots.filter(s => s.slot == slot).length >= 1) {
      return this.slots.filter(s => s.slot == slot)[0];
    }
    
    return null;
  }
}

module.exports = MultiplayerMatch;
