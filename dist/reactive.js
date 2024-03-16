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

// src/reactive.ts
class ReactiveValue extends Sentinel {
  _value;
  effects = new Set;
  constructor(_value) {
    super(true);
    this._value = _value;
  }
  peek() {
    return this._value;
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
}
export {
  ReactiveValue
};
