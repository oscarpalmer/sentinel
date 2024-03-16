// node_modules/@oscarpalmer/atoms/dist/js/queue.mjs
var queue = function(callback) {
  _atomic_queued.add(callback);
  if (_atomic_queued.size > 0) {
    queueMicrotask(() => {
      const callbacks = Array.from(_atomic_queued);
      _atomic_queued.clear();
      for (const callback2 of callbacks) {
        callback2();
      }
    });
  }
};
if (globalThis._atomic_effects === undefined) {
  const queued = new Set;
  Object.defineProperty(globalThis, "_atomic_queued", {
    get() {
      return queued;
    }
  });
}

// src/helpers.ts
function getValue(value) {
  const effect = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect != null) {
    value.effects.add(effect);
    effect.values.add(value);
  }
  return value._value;
}
function setValue(reactive, value, run) {
  if (!run && Object.is(reactive._value, value)) {
    return;
  }
  reactive._value = value;
  if (reactive.active) {
    for (const effect of reactive.effects) {
      queue(effect.callback);
    }
  }
}

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

// src/signal.ts
function signal(value) {
  return new Signal(value);
}

class Signal extends ReactiveValue {
  constructor() {
    super(...arguments);
  }
  get value() {
    return getValue(this);
  }
  set value(value) {
    setValue(this, value, false);
  }
  run() {
    if (this.active) {
      return;
    }
    this.active = true;
    setValue(this, this._value, true);
  }
  stop() {
    this.active = false;
  }
}
export {
  signal,
  Signal
};
