const path = require('path');
const fs = require('fs');

var RegisteredPlugins = [];

class Plugin {
  constructor() {
    this.name = "";
    this.hookedFunctions = [];
    this.description = "";
    this.author = "";
    this.mainFile = "";
    this.version = "";
    this.config = null;
  }
}

function AllHookedFunctions(hook) {
  // i'm lazy ok?
  return [].concat(...RegisteredPlugins.map((x) => x.hookedFunctions.filter(f => f.name == hook).map(h => ({
    hook: h.hook,
    by: x
  }))));
}

function HookInstance(by) {
  const RequireMain = (f) => {
    return require.main.require(f);
  };

  const Logger = require('../logging');
  const ConfigManager = by.config ? new(require('../ConfigManager'))(by.name, by.config) : undefined;

  return {
    RequireMain,
    Logger,
    ConfigManager
  };
}

function CallHook(hook, ...args) {
  var Logger = require('../logging');

  var f = AllHookedFunctions(hook);
  f.forEach(x => {
    Logger.Info(`Calling hook '${hook}' of '${x.by.name}'(${x.by.mainFile})...`);
    var i = HookInstance(x.by);
    x.hook.call(i, ...args);
    if(i.ConfigManager) i.ConfigManager.Save();
  });

  return true;
}

function LoadPlugins() {
  var Logger = require('../logging');

  var pluginsDirectoryPath = path.resolve(path.dirname(require.main.filename), "./plugins");

  fs.readdirSync(pluginsDirectoryPath).filter(f => fs.statSync(path.join(pluginsDirectoryPath, f)).isDirectory()).forEach((p) => {
    const pluginDir = path.join(pluginsDirectoryPath, p);

    if (!fs.existsSync(path.join(pluginDir, "package.json"))) {
      Logger.Failure(`Plugin '${p}' has an invalid package.json. It will not be registered.`);
      return;
    }

    const package = require(path.join(pluginDir, "package.json")); // read the package.json of the plugin

    if (package.main == null || !fs.existsSync(path.join(pluginDir, package.main))) {
      Logger.Failure(`Plugin '${p}' has an inexistent main file. It will not be registered.`);
      return;
    }

    var plugin = new Plugin(); // create an new plugin instance
    plugin.name = package.friendlyName ? package.friendlyName : package.name;
    plugin.description = package.description;
    plugin.author = package.author;
    plugin.mainFile = path.join(pluginDir, package.main);
    plugin.version = package.version;

    try {
      var m = require(path.join(pluginDir, package.main));
      plugin.hookedFunctions = m.hooks;
      plugin.config = m.configDefaults;
    } catch (ex) {
      Logger.Failure(`An error has occured in '${plugin.name}'. It will not be registered.\nStack trace: ${ex.stack}`);
      return;
    }

    RegisteredPlugins.push(plugin);
    if (m.hooks == null || m.hooks.length == 0) Logger.Success(`Plugin '${plugin.name}' registered!`);
    else Logger.Success(`Plugin '${plugin.name}' registered! (with ${m.hooks.length} hooks)`);
  });

  return true;
}

module.exports = {
  AllHookedFunctions,
  LoadPlugins,
  RegisteredPlugins,
  CallHook
};
