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
if (globalThis._atomic_queued === undefined) {
  const queued = new Set;
  Object.defineProperty(globalThis, "_atomic_queued", {
    get() {
      return queued;
    }
  });
}

// src/helpers.ts
function getValue(value) {
  const effect2 = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect2 != null) {
    value.effects.add(effect2);
    effect2.values.add(value);
  }
  return value._value;
}
function setValue(reactive, value, run) {
  if (!run && Object.is(reactive._value, value)) {
    return;
  }
  reactive._value = value;
  if (reactive.active) {
    for (const effect2 of reactive.effects) {
      queue(effect2.callback);
    }
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

// src/computed.ts
function computed(callback) {
  return new Computed(callback);
}

class Computed extends ReactiveValue {
  effect;
  get value() {
    return getValue(this);
  }
  constructor(callback) {
    super(undefined);
    this.effect = new Effect(() => setValue(this, callback(), false));
  }
  run() {
    this.effect.run();
  }
  stop() {
    this.effect.stop();
  }
}
// src/is.ts
function isComputed(value) {
  return isInstance(/^computed$/i, value);
}
function isEffect(value) {
  return isInstance(/^effect$/i, value);
}
var isInstance = function(expression, value) {
  return expression.test(value?.constructor?.name) && value.sentinel === true;
};
function isReactive(value) {
  return isComputed(value) || isSignal(value);
}
function isSignal(value) {
  return isInstance(/^signal$/i, value);
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
  isSignal,
  isReactive,
  isEffect,
  isComputed,
  effect,
  computed
};
