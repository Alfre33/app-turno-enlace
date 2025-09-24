const STORAGE_SYMBOL = Symbol.for("__async_storage__");

if (!globalThis[STORAGE_SYMBOL]) {
  globalThis[STORAGE_SYMBOL] = Object.create(null);
}

const state = globalThis[STORAGE_SYMBOL];

let persistToDisk = () => Promise.resolve();

try {
  const req = eval("require");
  if (req) {
    const path = req("path");
    const fs = req("fs");
    const storageFile = path.join(process.cwd(), ".async-storage.json");

    if (fs.existsSync(storageFile)) {
      try {
        const raw = fs.readFileSync(storageFile, "utf8");
        if (raw) {
          const parsed = JSON.parse(raw);
          Object.assign(state, parsed);
        }
      } catch (error) {
        // ignore read errors in local environments
      }
    }

    persistToDisk = () =>
      new Promise((resolve, reject) => {
        fs.writeFile(storageFile, JSON.stringify(state), "utf8", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
  }
} catch (error) {
  // Native environments (Hermes) do not expose `require`
}

async function getItem(key) {
  return Object.prototype.hasOwnProperty.call(state, key) ? state[key] : null;
}

async function setItem(key, value) {
  state[key] = value;
  await persistToDisk();
}

async function removeItem(key) {
  if (Object.prototype.hasOwnProperty.call(state, key)) {
    delete state[key];
    await persistToDisk();
  }
}

async function multiRemove(keys) {
  let removed = false;
  keys.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      removed = true;
      delete state[key];
    }
  });
  if (removed) {
    await persistToDisk();
  }
}

async function getAllKeys() {
  return Object.keys(state);
}

async function clear() {
  Object.keys(state).forEach((key) => delete state[key]);
  await persistToDisk();
}

module.exports = {
  getItem,
  setItem,
  removeItem,
  multiRemove,
  getAllKeys,
  clear,
};

module.exports.default = module.exports;
