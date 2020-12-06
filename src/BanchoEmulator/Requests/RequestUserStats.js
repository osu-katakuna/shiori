var TokenManager = require("../../TokenManager");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    const count = data.readInt16LE(0);

    if(count > 32) {
      return; // too big go away
    }

    if(data.length < (2 + (4 * count))) {
      return; // invalid size
    }

    const ids = [];
    for(var i = 0; i < count; i++) {
      ids.push(data.readInt16LE(2 + (4 * i)));
    }

    ids.forEach(id => {
      if(id == t.user.id) {
        return;
      }

      if((c = TokenManager.FindTokenUserID(id)) && !c.restricted) {
        t.NotifyUserStats(c.user);
      }
    });
  }
};
