// src/models.ts
if (globalThis._sentinels === undefined) {
  const effects = [];
  Object.defineProperty(globalThis, "_sentinels", {
    get() {
      return effects;
    }
  });
}

class Sentinel {
  active;
  sentinel = true;
  constructor(active) {
    this.active = active;
  }
}

// src/effect.ts
function effect(callback) {
  return new Effect(callback);
}

class Effect extends Sentinel {
  callback;
  values = new Set;
  constructor(callback) {
    super(false);
    this.callback = callback;
    this.run();
  }
  run() {
    if (this.active) {
      return;
    }
    this.active = true;
    const index = globalThis._sentinels.push(this) - 1;
    this.callback();
    globalThis._sentinels.splice(index, 1);
  }
  stop() {
    if (!this.active) {
      return;
    }
    this.active = false;
    for (const value of this.values) {
      value.effects.delete(this);
    }
    this.values.clear();
  }
}
export {
  effect,
  Effect
};
