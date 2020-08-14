var TokenManager = require("../../TokenManager");

module.exports = ({req, res, token, data}) => {
  if((t = TokenManager.GetToken(token)) != null) {
    console.log("NOT IMPLEMENTED!!! ADD DB!!! Add friend:", data.readInt32LE());
  }
};
