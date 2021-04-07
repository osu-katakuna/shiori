const fs = require('fs');
const path = require('path');

class ConfigManager {
  constructor(module, defaultConfig = {}) {
    this.logger = require("../Logger");
    this.module = module;
    this.configFile = path.join(path.dirname(require.main.filename), `./config/${module}.json`);
    this.defaults = defaultConfig;
    this.configEntries = [];

    if(!fs.existsSync(this.configFile)) {
      this.logger.Info(`Configuration file for ${module} doesn't exist. Creating ${this.configFile}...`);
      for(var k in this.defaults) this.DefineConfigProperty(k, this.defaults[k]);
      this.Save();
    } else {
      var c = require(this.configFile);
      for(var k in c) this.DefineConfigProperty(k, c[k]);

      var unusedConfig = Object.keys(this.defaults).filter(x => !Object.keys(c).includes(x));
      if(unusedConfig.length > 0) {
        this.logger.Info(`Configuration file for ${module} has some new parameters. Modifying ${this.configFile}...`);
        unusedConfig.forEach(k => this.DefineConfigProperty(k, this.defaults[k]));
        this.Save();
      }
    }
  }

  DefineConfigProperty(property, value) {
    this.configEntries.push({
      name: property,
      value: value
    });

    Object.defineProperty(this, property, {
      get() {
        return this.configEntries.filter(x => x.name == property)[0].value;
      },

      set(value) {
        this.configEntries.filter(x => x.name == property)[0].value = value;
      }
    });
  }

  Save() {
    const c = {};
    this.configEntries.forEach(x => { c[x.name] = x.value; });
    fs.writeFileSync(this.configFile, JSON.stringify(c, null, 2))
  }
}

module.exports = ConfigManager;
