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
  }
}

class MultiplayerMatch {
  constructor(name, host, password = null, maxPlayers = 8, publicHistory = false) {
    if(!(host instanceof Token)) throw new Error("host must be an instance of Token");

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
  }

  join(player) {
    if(!(player instanceof Token)) throw new Error("player must be an instance of Token");

    this.slots.push(new MultiplayerSlot(this.slots.length, player, MultiplayerSlotStatus.NotReady));
    player.inMatch = true;
    player.matchID = this.id;
    player.NotifyJoinedMPLobby(this); // notify the player we joined the lobby

    this.update();
  }

  leave(player) {
    if(!(player instanceof Token)) throw new Error("player must be an instance of Token");

    this.slots = this.slots.filter(slot => slot.player !== player);
    player.inMatch = false;
    player.matchID = -1;

    this.update();
  }

  update() {
    this.slots.forEach(slot => slot.player.NotifyMPLobby(this));
  }

  getSlot(slot) {
    if(slot > 16) return null;
    if(this.slots.filter(s => s.slot == slot).length >= 1) return this.slots.filter(s => s.slot == slot)[0];
    return new MultiplayerSlot(slot, null, slot > this.maxSlots - 1 ? MultiplayerSlotStatus.Locked : MultiplayerSlotStatus.Free);
  }
}

module.exports = MultiplayerMatch;
