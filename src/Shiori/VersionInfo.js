/**
################# PLEASE DO NOT TOUCH THIS FILE! #################

This file is used in order to know the version of this server.
If modified, it may result in unexpected behaviour!

YOU HAVE BEEN WARNED!

##################################################################
**/

const versionInfo = {
  major: 2,
  minor: 14,
  patch: 18,
  version: "beta"
};

module.exports = versionInfo;
module.exports.formatted = `v${versionInfo.major}.${versionInfo.minor}.${versionInfo.patch}` + (versionInfo.version != null && versionInfo.version.length > 0 ? `-${versionInfo.version}` : "");
