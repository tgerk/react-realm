// EVIL MONKEY-PATCHING

Storage.prototype.getJSONItem = function (key, defaultValue) {
  try {
    const value = this.getItem(key);
    return JSON.parse(value);
  } catch (e) {
    return defaultValue;
  }
};

Storage.prototype.setJSONItem = function (key, value) {
  this.setItem(key, JSON.stringify(value));
};
