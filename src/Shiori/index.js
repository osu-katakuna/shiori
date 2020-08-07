var PluginManager = require('../PluginManager');
var ConfigManager = require("./ShioriConfig");
var WebServer = require('../Webserver');
var Logger = require('../logging');
var RedisSubsystem = require("../Redis");
var Database = require("../Database");
var ChannelManager = require('../ChannelManager');

function Start() {
  // reset logger timing
  Logger.ResetTiming();

  const serverStartTime = new Date().getTime();

  // let the user know we started.
  Logger.Info("Welcome to katakuna!shiori.");

  // go and load all plugins
  Logger.Info("Loading plugins...");

  // make an time difference to check out how much it takes to load plugins.
  const pluginStartTime = new Date().getTime();

  // load the plugins
  if(!PluginManager.LoadPlugins()) {
    Logger.Error('An error has occured while loading the plugins!');
    return;
  }

  // get the difference now.
  const pluginLoadTime = (new Date().getTime() - pluginStartTime) / 1000;

  // show how many plugins we loaded and the time it took to load.
  Logger.Success(`Loaded ${PluginManager.RegisteredPlugins.length} plugin(s) in ${pluginLoadTime}s.`);

  Logger.Info("Initializing database connection...");

  // initialize DB Connection
  Database.Init();
  Database.GetSubsystem().Connect();

  Logger.Success("Connected to the database.");

  // start an Redis connection
  RedisSubsystem.Start();

  // Subscribe to the channels
  RedisSubsystem.SubscribeToChannel("shiori:test", function(d) {
    Logger.Success("Received test command.");
  });

  // start the web server.
  WebServer.StartServer();

  // perform the hook call!
  PluginManager.CallHook("serverStart");

  const serverLoadTime = (new Date().getTime() - serverStartTime) / 1000;
  Logger.Success(`katakuna!shiori loaded in ${serverLoadTime}s. Listening on port ${ConfigManager.server.port}`);
}

module.exports = Start;