const StatusType = {
	IDLE: 0,
	AFK: 1,
	PLAYING: 2,
	EDITING: 3,
	MODDING: 4,
	MULTIPLAYER: 5,
	WATCHING: 6,
	UNKNOWN: 7,
	TESTING: 8,
	SUBMITTING: 9,
	PAUSED: 10,
	LOBBY: 11,
	MULTIPLAYING: 12,
	DIRECT: 13,
};

class Status {
  constructor() {
    this.type = StatusType.IDLE;
    this.hash = "";
    this.text = "";
    this.mods = 0;
	this.gameMode = 0;
  }
}

module.exports = {
  Status,
  StatusType
};
