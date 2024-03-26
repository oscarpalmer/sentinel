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
  constructor(type, active) {
    this.state = { active, type };
  }
}

// src/effect.ts
function effect(callback) {
  return new Effect(callback);
}

class Effect extends Sentinel {
  constructor(callback) {
    super("effect", false);
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
  return value?.state?.type === "computed";
}
function isEffect(value) {
  return value?.state?.type === "effect";
}
function isList(value) {
  return value?.state?.type === "list";
}
function isReactive(value) {
  return ["computed", "list", "signal", "store"].includes(value?.state?.type);
}
function isSignal(value) {
  return value?.state?.type === "signal";
}
function isStore(value) {
  return value?.state?.type === "store";
}
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
function getValue(reactive) {
  watch(reactive);
  return reactive.state.value;
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
  if (!Object.is(reactive.state.value, value)) {
    reactive.state.value = value;
    emit(reactive);
  }
}

// src/reactive/value.ts
class ReactiveValue extends Sentinel {
  constructor(type, value) {
    super(type, true);
    this.state.effects = new Set;
    this.state.subscribers = new Map;
    this.state.value = value;
  }
  get() {
    return this.value;
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
    const { subscribers, value } = this.state;
    if (subscribers.has(subscriber)) {
      return;
    }
    subscribers.set(subscriber, () => subscriber(value));
    subscriber(value);
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return String(this.value);
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
  get value() {
    return getValue(this);
  }
  constructor(callback) {
    super("computed", undefined);
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
  get value() {
    return getValue(this);
  }
  get(property) {
    return property == null ? getValue(this) : this.value[property];
  }
  peek(property) {
    return property == null ? this.state.value : this.state.value[property];
  }
  set(property, value5) {
    this.state.value[property] = value5;
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
  get length() {
    return this.state.length.value;
  }
  set length(value8) {
    this.state.value.length = value8 < 0 ? 0 : value8;
  }
  constructor(value8) {
    super("list", new Proxy(value8, {
      get: (target, property) => {
        return operations.has(property) ? operation(this, this.state.length, target, property) : Reflect.get(target, property);
      },
      set: (target, property, value9) => setProxyValue(this, target, this.state.length, property, value9)
    }));
    this.state.length = new Signal(value8.length);
  }
  at(index) {
    return this.state.value.at(index);
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
