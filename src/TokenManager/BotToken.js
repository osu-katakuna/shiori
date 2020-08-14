const Token = require('./Token');

const Packets = require('../BanchoEmulator/Packets');
const Logger = require('../logging');
const ChannelManager = require('../ChannelManager');
const Status = require('../Models/Status').Status;
const StatusType = require('../Models/Status').StatusType;

class BotToken extends Token {
  constructor(user, token) {
    super(user, token);
  }

  get stats() {
    return {
      pp: 0,
      rank: 0,
      totalScore: 0,
      totalRankedScore: 0,
      playCount: 0,
      accuracy: 0,
      gameMode: 0
    };
  }
}

module.exports = BotToken;
