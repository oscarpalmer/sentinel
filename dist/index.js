// src/global.ts
if (globalThis._sentinels === undefined) {
  const effects = [];
  Object.defineProperty(globalThis, "_sentinels", {
    get() {
      return effects;
    }
  });
}

// src/models.ts
class Sentinel {
  type;
  active;
  constructor(type, active) {
    this.type = type;
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
    super("effect", false);
    this.callback = callback;
    this.start();
  }
  start() {
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

// src/helpers/index.ts
function emitValue(reactive) {
  if (reactive.active) {
    for (const effect2 of reactive.effects) {
      queue(effect2.callback);
    }
  }
}
function getValue(reactive) {
  const effect2 = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect2 != null) {
    reactive.effects.add(effect2);
    effect2.values.add(reactive);
  }
  return reactive._value;
}
var setAndEmit = function(reactive, key, value) {
  reactive[key] = value;
  emitValue(reactive);
};
function setProxyValue(reactive, target, length, property, value) {
  const previous = Reflect.get(target, property);
  if (Object.is(previous, value)) {
    return true;
  }
  const result = Reflect.set(target, property, value);
  if (result) {
    emitValue(reactive);
    if (Array.isArray(target)) {
      length?.set(target.length);
    }
  }
  return result;
}
function setValue(reactive, value) {
  if (!Object.is(reactive._value, value)) {
    setAndEmit(reactive, "_value", value);
  }
}
function startReactivity(reactive) {
  if (!reactive.active) {
    setAndEmit(reactive, "active", true);
  }
}
function stopReactivity(reactive) {
  if (!reactive.active) {
    return;
  }
  reactive.active = false;
  for (const effect2 of reactive.effects) {
    effect2.values.delete(reactive);
  }
}

// src/reactive/index.ts
class ReactiveValue extends Sentinel {
  _value;
  effects = new Set;
  constructor(type, _value) {
    super(type, true);
    this._value = _value;
  }
  get() {
    return this.value;
  }
  peek() {
    return this._value;
  }
  run() {
    startReactivity(this);
  }
  stop() {
    stopReactivity(this);
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
}

class ReactiveObject extends ReactiveValue {
  constructor() {
    super(...arguments);
  }
  get value() {
    return getValue(this);
  }
  get(property) {
    return property == null ? getValue(this) : this.value[property];
  }
  peek(property) {
    return property == null ? this._value : this._value[property];
  }
  set(property, value) {
    this._value[property] = value;
  }
}

// src/reactive/computed.ts
function computed(callback) {
  return new Computed(callback);
}

class Computed extends ReactiveValue {
  get value() {
    return getValue(this);
  }
  effect;
  constructor(callback) {
    super("computed", undefined);
    this.effect = new Effect(() => setValue(this, callback()));
  }
  run() {
    this.effect.start();
  }
  stop() {
    this.effect.stop();
  }
}
// src/helpers/is.ts
function isComputed(value) {
  return value?.type === "computed";
}
function isEffect(value) {
  return value?.type === "effect";
}
function isItem(value) {
  return value?.type === "item";
}
function isList(value) {
  return value?.type === "list";
}
function isReactive(value) {
  return ["computed", "item", "list", "signal"].includes(value?.type);
}
function isSignal(value) {
  return value?.type === "signal";
}
// src/reactive/item.ts
function item(value) {
  return new Item(value);
}

class Item extends ReactiveObject {
  constructor(value) {
    super("item", new Proxy(value, {
      set: (target, property, value2) => setProxyValue(this, target, undefined, property, value2)
    }));
  }
}
// src/reactive/signal.ts
function signal(value) {
  return new Signal(value);
}

class Signal extends ReactiveValue {
  get value() {
    return getValue(this);
  }
  set value(value) {
    setValue(this, value);
  }
  constructor(value) {
    super("signal", value);
  }
  set(value) {
    setValue(this, value);
  }
}

// src/reactive/list.ts
function list(value) {
  return new List(value);
}
var operation = function(list2, length, array, operation2) {
  return (...args) => {
    const result = array[operation2](...args);
    emitValue(list2);
    length.set(array.length);
    return result;
  };
};
var operations = new Set([
  "copyWithin",
  "fill",
  "pop",
  "push",
  "reverse",
  "shift",
  "sort",
  "splice",
  "unshift"
]);

class List extends ReactiveObject {
  _length = new Signal(0);
  get length() {
    return this._length.value;
  }
  get value() {
    return getValue(this);
  }
  set length(value) {
    this._value.length = value < 0 ? 0 : value;
  }
  constructor(value) {
    super("list", new Proxy(value, {
      get: (target, property) => {
        return operations.has(property) ? operation(this, this._length, target, property) : Reflect.get(target, property);
      },
      set: (target, property, value2) => setProxyValue(this, target, this._length, property, value2)
    }));
    this._length.value = value.length;
  }
  at(index) {
    return this._value.at(index);
  }
}
export {
  signal,
  list,
  item,
  isSignal,
  isReactive,
  isList,
  isItem,
  isEffect,
  isComputed,
  effect,
  computed
};
