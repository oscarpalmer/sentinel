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
if (globalThis._sentinels == null) {
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
    if (!this.active) {
      this.state.active = true;
      const index = globalThis._sentinels.push(this) - 1;
      this.state.callback();
      globalThis._sentinels.splice(index, 1);
    }
  }
  stop() {
    if (this.active) {
      this.state.active = false;
      for (const value of this.state.values) {
        value.state.effects.delete(this);
      }
      this.state.values.clear();
    }
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
// src/helpers/effect.ts
function watch(reactive) {
  const effect2 = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect2 != null) {
    reactive.state.effects.add(effect2);
    effect2.state.values.add(reactive);
  }
}

// src/helpers/event.ts
function disable(reactive) {
  if (reactive.active) {
    reactive.state.active = false;
    for (const effect2 of reactive.state.effects) {
      effect2.state.values.delete(reactive);
    }
  }
}
function emit(reactive) {
  if (reactive.active) {
    const { effects, subscribers } = reactive.state;
    const callbacks = [...effects, ...subscribers.values()].map((value) => typeof value === "function" ? value : value.state.callback);
    for (const callback of callbacks) {
      queue(callback);
    }
  }
}
function enable(reactive) {
  if (!reactive.active) {
    reactive.state.active = true;
    emit(reactive);
  }
}

// src/helpers/value.ts
function getValue(reactive) {
  watch(reactive);
  return reactive.state.value;
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
var arrayOperations = new Set([
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
// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
var isArrayOrPlainObject = function(value4) {
  return Array.isArray(value4) || isPlainObject(value4);
};
var isPlainObject = function(value4) {
  if (typeof value4 !== "object" || value4 === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value4);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value4) && !(Symbol.iterator in value4);
};

// src/helpers/proxy.ts
function createProxy(store, value5, length) {
  const isArray = Array.isArray(value5);
  const proxied = new Proxy(isArray ? value5 : {}, {
    get: (target, property) => getProxyValue(store, target, property, isArray),
    set: (target, property, value6) => setProxyValue(store, target, property, value6, length)
  });
  if (!isArray) {
    const keys = Object.keys(value5);
    const size = keys.length;
    let index = 0;
    for (;index < size; index += 1) {
      const key = keys[index];
      proxied[key] = value5[key];
    }
  }
  return proxied;
}
function getProxyValue(obj, target, property, isArray, length) {
  return isArray && arrayOperations.has(property) ? updateArray(obj, target, property, length) : Reflect.get(target, property);
}
function setProxyValue(obj, target, property, value5, length) {
  const previous = Reflect.get(target, property);
  if (Object.is(previous, value5)) {
    return true;
  }
  const next = length != null && isArrayOrPlainObject(value5) ? createProxy(obj, value5) : value5;
  const result = Reflect.set(target, property, next);
  if (result) {
    emit(obj);
    length?.set(target.length);
  }
  return result;
}

// src/reactive/object.ts
class ReactiveObject extends ReactiveValue {
  constructor(value7, isArray, length) {
    super(isArray ? [] : {});
    this.state.value = createProxy(this, value7, length);
  }
  get(property) {
    return property == null ? getValue(this) : this.state.value[property];
  }
  peek(property) {
    return property == null ? this.state.value : this.state.value[property];
  }
  set(property, value7) {
    this.state.value[property] = value7;
  }
}

// src/reactive/signal.ts
function signal(value9) {
  return new Signal(value9);
}

class Signal extends ReactiveValue {
  constructor() {
    super(...arguments);
  }
  set(value9) {
    setValue(this, value9);
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
    const length = new Signal(value9.length);
    super(value9, true, length);
    this.state.length = length;
  }
  at(index) {
    return this.state.value.at(index);
  }
  map(callbackfn) {
    return new Computed(() => this.state.value.map(callbackfn));
  }
  push(...values) {
    return this.state.value.push(...values);
  }
  splice(start, deleteCount, ...values) {
    return this.state.value.splice(start, deleteCount ?? 0, ...values);
  }
}

// src/reactive/store.ts
function store(value9) {
  return new Store(value9);
}

class Store extends ReactiveObject {
  constructor(value9) {
    super({}, false);
    this.state.value = createProxy(this, value9);
  }
}

// src/reactive/index.ts
function reactive(value9) {
  if (value9 == null || isReactive(value9)) {
    return value9;
  }
  switch (true) {
    case Array.isArray(value9):
      return new List(value9);
    case isPlainObject(value9):
      return new Store(value9);
    case typeof value9 === "function":
      return new Computed(value9);
    case ["boolean", "number", "string"].includes(typeof value9):
      return new Signal(value9);
    default:
      return value9;
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
