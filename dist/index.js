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

// src/helpers/event.ts
function emit(reactive) {
  if (reactive.active) {
    for (const effect2 of reactive.effects) {
      queue(effect2.callback);
    }
  }
}
function listen(reactive) {
  if (!reactive.active) {
    reactive.active = true;
    emit(reactive);
  }
}
function silence(reactive) {
  if (!reactive.active) {
    return;
  }
  reactive.active = false;
  for (const effect2 of reactive.effects) {
    effect2.values.delete(reactive);
  }
}

// src/helpers/value.ts
function getValue(reactive) {
  const effect2 = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect2 != null) {
    reactive.effects.add(effect2);
    effect2.values.add(reactive);
  }
  return reactive._value;
}
function setProxyValue(reactive, target, length, property, value) {
  const previous = Reflect.get(target, property);
  if (Object.is(previous, value)) {
    return true;
  }
  const result = Reflect.set(target, property, value);
  if (result) {
    emit(reactive);
    if (Array.isArray(target)) {
      length?.set(target.length);
    }
  }
  return result;
}
function setValue(reactive, value) {
  if (!Object.is(reactive._value, value)) {
    reactive._value = value;
    emit(reactive);
  }
}

// src/reactive/value.ts
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
    listen(this);
  }
  stop() {
    silence(this);
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return String(this.value);
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
function isComputed(value3) {
  return value3?.type === "computed";
}
function isEffect(value3) {
  return value3?.type === "effect";
}
function isList(value3) {
  return value3?.type === "list";
}
function isReactive(value3) {
  return ["computed", "list", "signal", "store"].includes(value3?.type);
}
function isSignal(value3) {
  return value3?.type === "signal";
}
function isStore(value3) {
  return value3?.type === "store";
}
// src/reactive/object.ts
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
  set(property, value5) {
    this._value[property] = value5;
  }
}

// src/reactive/signal.ts
function signal(value7) {
  return new Signal(value7);
}

class Signal extends ReactiveValue {
  get value() {
    return getValue(this);
  }
  set value(value7) {
    setValue(this, value7);
  }
  constructor(value7) {
    super("signal", value7);
  }
  set(value7) {
    setValue(this, value7);
  }
}

// src/reactive/list.ts
function list(value8) {
  return new List(value8);
}
var operation = function(list2, length, array, operation2) {
  return (...args) => {
    const result = array[operation2](...args);
    emit(list2);
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
  set length(value8) {
    this._value.length = value8 < 0 ? 0 : value8;
  }
  constructor(value8) {
    super("list", new Proxy(value8, {
      get: (target, property) => {
        return operations.has(property) ? operation(this, this._length, target, property) : Reflect.get(target, property);
      },
      set: (target, property, value9) => setProxyValue(this, target, this._length, property, value9)
    }));
    this._length.value = value8.length;
  }
  at(index) {
    return this._value.at(index);
  }
}
// src/reactive/store.ts
function store(value9) {
  return new Store(value9);
}

class Store extends ReactiveObject {
  constructor(value9) {
    super("store", new Proxy(value9, {
      set: (target, property, value10) => setProxyValue(this, target, undefined, property, value10)
    }));
  }
}
export {
  store,
  signal,
  list,
  isStore,
  isSignal,
  isReactive,
  isList,
  isEffect,
  isComputed,
  effect,
  computed
};
