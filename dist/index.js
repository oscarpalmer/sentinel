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
  get active() {
    return this.state.active;
  }
  constructor(active) {
    this.state = { active };
  }
}

// src/effect.ts
function effect(callback) {
  return new Effect(callback);
}

class Effect extends Sentinel {
  constructor(callback) {
    super(false);
    this.state.callback = callback;
    this.state.values = new Set;
    this.start();
  }
  start() {
    if (this.active) {
      return;
    }
    this.state.active = true;
    const index = globalThis._sentinels.push(this) - 1;
    this.state.callback();
    globalThis._sentinels.splice(index, 1);
  }
  stop() {
    if (!this.active) {
      return;
    }
    this.state.active = false;
    for (const value of this.state.values) {
      value.state.effects.delete(this);
    }
    this.state.values.clear();
  }
}
// src/helpers/is.ts
function isComputed(value) {
  return isInstance(value, /^computed$/i);
}
function isEffect(value) {
  return isInstance(value, /^effect$/i);
}
var isInstance = function(value, expression) {
  return expression.test(value?.constructor?.name ?? "");
};
function isList(value) {
  return isInstance(value, /^list$/i);
}
function isReactive(value) {
  return isInstance(value, /^computed|list|signal|store$/i);
}
function isSignal(value) {
  return isInstance(value, /^signal$/i);
}
function isStore(value) {
  return isInstance(value, /^store$/i);
}
// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
var isArrayOrPlainObject = function(value) {
  return Array.isArray(value) || isPlainObject(value);
};
var isPlainObject = function(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
};

// src/helpers/effect.ts
function watch(reactive) {
  const effect2 = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect2 == null) {
    return;
  }
  reactive.state.effects.add(effect2);
  effect2.state.values.add(reactive);
}

// src/helpers/event.ts
function disable(reactive) {
  if (!reactive.active) {
    return;
  }
  reactive.state.active = false;
  for (const effect2 of reactive.state.effects) {
    effect2.state.values.delete(reactive);
  }
}
function emit(reactive) {
  if (!reactive.active) {
    return;
  }
  const { effects, subscribers } = reactive.state;
  const callbacks = [...effects, ...subscribers.values()].map((value) => typeof value === "function" ? value : value.state.callback);
  for (const callback of callbacks) {
    queue(callback);
  }
}
function enable(reactive) {
  if (!reactive.active) {
    reactive.state.active = true;
    emit(reactive);
  }
}

// src/helpers/value.ts
function getProxyValue(obj, target, property, isArray) {
  return isArray && operations.has(property) ? updateArray(obj, target, property) : Reflect.get(target, property);
}
function getValue(reactive) {
  watch(reactive);
  return reactive.state.value;
}
function setProxyValue(obj, target, property, value, length, wrapper) {
  const previous = Reflect.get(target, property);
  if (Object.is(previous, value)) {
    return true;
  }
  const next = typeof wrapper === "function" && isArrayOrPlainObject(value) ? wrapper(obj, value) : value;
  const result = Reflect.set(target, property, next);
  if (result) {
    emit(obj);
    length?.set(target.length);
  }
  return result;
}
function setValue(reactive, value) {
  if (!Object.is(reactive.state.value, value)) {
    reactive.state.value = value;
    emit(reactive);
  }
}
function updateArray(obj, array, operation, length) {
  return (...args) => {
    const result = array[operation](...args);
    emit(obj);
    length?.set(array.length);
    return result;
  };
}
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

// src/reactive/value.ts
class ReactiveValue extends Sentinel {
  constructor(value2) {
    super(true);
    this.state.effects = new Set;
    this.state.subscribers = new Map;
    this.state.value = value2;
  }
  get() {
    return getValue(this);
  }
  peek() {
    return this.state.value;
  }
  run() {
    enable(this);
  }
  stop() {
    disable(this);
  }
  subscribe(subscriber) {
    const { subscribers, value: value2 } = this.state;
    if (subscribers.has(subscriber)) {
      return () => {
      };
    }
    subscribers.set(subscriber, () => subscriber(value2));
    subscriber(value2);
    return () => {
      this.state.subscribers.delete(subscriber);
    };
  }
  toJSON() {
    return this.get();
  }
  toString() {
    return String(this.get());
  }
  unsubscribe(subscriber) {
    this.state.subscribers.delete(subscriber);
  }
}

// src/reactive/computed.ts
function computed(callback) {
  return new Computed(callback);
}

class Computed extends ReactiveValue {
  constructor(callback) {
    super(undefined);
    this.state.effect = new Effect(() => setValue(this, callback()));
  }
  run() {
    this.state.effect.start();
  }
  stop() {
    this.state.effect.stop();
  }
}

// src/reactive/object.ts
class ReactiveObject extends ReactiveValue {
  constructor() {
    super(...arguments);
  }
  get(property) {
    return property == null ? getValue(this) : this.state.value[property];
  }
  peek(property) {
    return property == null ? this.state.value : this.state.value[property];
  }
  set(property, value6) {
    this.state.value[property] = value6;
  }
}

// src/reactive/signal.ts
function signal(value8) {
  return new Signal(value8);
}

class Signal extends ReactiveValue {
  constructor() {
    super(...arguments);
  }
  set(value8) {
    setValue(this, value8);
  }
  update(updater) {
    this.set(updater(this.get()));
  }
}

// src/reactive/list.ts
function list(value9) {
  return new List(value9);
}

class List extends ReactiveObject {
  get length() {
    return this.state.length.get();
  }
  set length(value9) {
    this.state.value.length = value9 < 0 ? 0 : value9;
  }
  constructor(value9) {
    super(new Proxy(value9, {
      get: (target, property) => getProxyValue(this, target, property, true),
      set: (target, property, value10) => setProxyValue(this, target, property, value10, this.state.length)
    }));
    this.state.length = new Signal(value9.length);
  }
  at(index) {
    return this.state.value.at(index);
  }
  map(callbackfn) {
    return new Computed(() => this.get().map(callbackfn));
  }
  push(...values) {
    return this.get().push(...values);
  }
  splice(start, deleteCount, ...values) {
    return this.get().splice(start, deleteCount ?? 0, ...values);
  }
}

// src/reactive/store.ts
var proxy = function(store, value10) {
  const isArray = Array.isArray(value10);
  const proxied = new Proxy(isArray ? [] : {}, {
    get: (target, property) => getProxyValue(store, target, property, isArray),
    set: (target, property, value11) => setProxyValue(store, target, property, value11, undefined, proxy)
  });
  const keys = Object.keys(value10);
  const { length } = keys;
  let index = 0;
  for (;index < length; index += 1) {
    const key = keys[index];
    proxied[key] = value10[key];
  }
  return proxied;
};
function store(value10) {
  return new Store(value10);
}

class Store extends ReactiveObject {
  constructor(value10) {
    super({});
    this.state.value = proxy(this, value10);
  }
}

// src/reactive/index.ts
function reactive(value10) {
  if (value10 == null || isReactive(value10)) {
    return value10;
  }
  switch (true) {
    case Array.isArray(value10):
      return new List(value10);
    case isPlainObject(value10):
      return new Store(value10);
    case typeof value10 === "function":
      return new Computed(value10);
    case ["boolean", "number", "string"].includes(typeof value10):
      return new Signal(value10);
    default:
      return value10;
  }
}
export {
  store,
  signal,
  reactive,
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
