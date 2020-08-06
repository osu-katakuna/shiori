const User = require("./src/Models/User");

console.log(User.where([["id", "1000"], ["username", "talnacialex"]]));
