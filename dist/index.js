// node_modules/@oscarpalmer/atoms/dist/js/queue.mjs
function queue(callback) {
  _atomic_queued.add(callback);
  if (_atomic_queued.size > 0) {
    queueMicrotask(() => {
      const callbacks = [..._atomic_queued];
      const { length } = callbacks;
      _atomic_queued.clear();
      for (let index = 0;index < length; index += 1) {
        callbacks[index]();
      }
    });
  }
}
if (globalThis._atomic_queued == null) {
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

// src/effect.ts
function effect(callback) {
  return new Effect(callback);
}
function watch(reactive, key) {
  const effect2 = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect2 != null) {
    if (key == null) {
      reactive.callbacks.any.add(effect2);
    } else {
      if (!reactive.callbacks.keys.has(key)) {
        reactive.callbacks.keys.add(key);
        reactive.callbacks.values.set(key, new Set);
      }
      reactive.callbacks.values.get(key)?.add(effect2);
    }
    effect2.reactives.add(reactive);
  }
}

class Effect {
  $sentinel = "effect";
  state;
  constructor(callback) {
    this.state = {
      callback,
      active: false,
      reactives: new Set
    };
    this.start();
  }
  start() {
    if (!this.state.active) {
      this.state.active = true;
      const index = globalThis._sentinels.push(this.state) - 1;
      this.state.callback();
      globalThis._sentinels.splice(index, 1);
    }
  }
  stop() {
    if (this.state.active) {
      this.state.active = false;
      for (const reactive of this.state.reactives) {
        reactive.callbacks.any.delete(this.state);
        for (const [key, keyed] of reactive.callbacks.values) {
          keyed.delete(this.state);
          if (keyed.size === 0) {
            reactive.callbacks.keys.delete(key);
          }
        }
      }
      this.state.reactives.clear();
    }
  }
}
// src/helpers/is.ts
function isArray(value) {
  return isSentinel(value, /^array$/i);
}
function isComputed(value) {
  return isSentinel(value, /^computed$/i);
}
function isEffect(value) {
  return isSentinel(value, /^effect$/i);
}
function isReactive(value) {
  return isSentinel(value, /^array|computed|signal|store$/i);
}
function isSentinel(value, expression) {
  return expression.test(value?.$sentinel ?? "");
}
function isStore(value) {
  return isSentinel(value, /^store$/i);
}
function isSignal(value) {
  return isSentinel(value, /^signal$/i);
}
// node_modules/@oscarpalmer/atoms/dist/js/function.mjs
function noop() {
}

// src/helpers/subscription.ts
function subscribe(state, subscriber, key) {
  let set;
  if (key != null) {
    if (state.callbacks.keys.has(key)) {
      set = state.callbacks.values.get(key);
    } else {
      set = new Set;
      state.callbacks.keys.add(key);
      state.callbacks.values.set(key, set);
    }
  } else {
    set = state.callbacks.any;
  }
  if (set == null || set.has(subscriber)) {
    return noop;
  }
  set.add(subscriber);
  subscriber(state.value);
  return () => {
    unsubscribe(state, subscriber, key);
  };
}
function subscribeOrUnsubscribe(type, state, first, second) {
  const firstIsSubscriber = typeof first === "function";
  return (type === "subscribe" ? subscribe : unsubscribe)(state, firstIsSubscriber ? first : second, firstIsSubscriber ? undefined : first);
}
function unsubscribe(state, subscriber, key) {
  if (key != null) {
    const set = state.callbacks.values.get(key);
    if (set != null) {
      if (subscriber == null) {
        set.clear();
      } else {
        set.delete(subscriber);
      }
      if (set.size === 0) {
        state.callbacks.keys.delete(key);
        state.callbacks.values.delete(key);
      }
    }
  } else if (subscriber != null) {
    state.callbacks.any.delete(subscriber);
  }
}

// src/helpers/event.ts
function disable(state) {
  if (state.active) {
    state.active = false;
    const effects = [...state.callbacks.any, ...state.callbacks.values.values()].flatMap((value) => value instanceof Set ? [...value.values()] : value).filter((value) => typeof value !== "function");
    for (const fx of effects) {
      if (typeof fx !== "function") {
        fx.reactives.delete(state);
      }
    }
  }
}
function emit(state, keys) {
  if (state.active) {
    const subscribers = [
      ...state.callbacks.any,
      ...[...state.callbacks.values.entries()].filter(([key]) => keys == null || keys.includes(key)).map(([, value]) => value)
    ].flatMap((value) => value instanceof Set ? [...value.values()] : value).map((value) => typeof value === "function" ? value : value.callback);
    for (const subsriber of subscribers) {
      if (typeof subsriber === "function") {
        queue(() => {
          subsriber(state.value);
        });
      }
    }
  }
}
function enable(state) {
  if (!state.active) {
    state.active = true;
    emit(state);
  }
}

// src/helpers/value.ts
function getValue(reactive, key) {
  watch(reactive, typeof key === "symbol" ? undefined : key);
  return key == null ? reactive.value : Array.isArray(reactive.value) ? reactive.value.at(key) : reactive.value[key];
}
function setValue(reactive, value) {
  if (!Object.is(reactive.value, value)) {
    reactive.value = value;
    emit(reactive);
  }
}
function updateArray(reactive, array, operation, length) {
  const previous = array.slice();
  return (...args) => {
    const result = array[operation](...args);
    let changed;
    if (reactive.callbacks.keys.size > 0) {
      changed = [];
      for (const key of reactive.callbacks.keys) {
        if (typeof key === "number" && !Object.is(previous.at(key), array.at(key))) {
          changed.push(key);
        }
      }
    }
    emit(reactive, changed);
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

// src/reactive/instance.ts
class ReactiveInstance {
  state;
  constructor(type, value2) {
    this.$sentinel = type;
    this.state = {
      value: value2,
      active: true,
      callbacks: {
        any: new Set,
        keys: new Set,
        values: new Map
      }
    };
  }
  get() {
    return getValue(this.state);
  }
  peek() {
    return this.state.value;
  }
  run() {
    enable(this.state);
  }
  stop() {
    disable(this.state);
  }
  toJSON() {
    return getValue(this.state);
  }
  toString() {
    return String(getValue(this.state));
  }
}

// src/reactive/value.ts
class ReactiveValue extends ReactiveInstance {
  subscribe(subscriber) {
    return subscribe(this.state, subscriber);
  }
  unsubscribe(subscriber) {
    if (subscriber == null) {
      this.state.callbacks.any.clear();
    } else {
      this.state.callbacks.any.delete(subscriber);
    }
  }
}

// src/reactive/computed.ts
function computed(value4) {
  return new Computed(value4);
}

class Computed extends ReactiveValue {
  fx;
  constructor(value4) {
    super("computed", undefined);
    this.fx = effect(() => setValue(this.state, value4()));
  }
  run() {
    this.fx.start();
  }
  stop() {
    this.fx.stop();
  }
}

// src/helpers/proxy.ts
function getProxyValue(reactive, target, property, length) {
  if (length != null && arrayOperations.has(property)) {
    return updateArray(reactive, target, property, length);
  }
  const value5 = Reflect.get(target, property);
  return isReactive(value5) ? value5.get() : value5;
}
function setProxyValue(reactive, target, property, value5, length) {
  if (Object.is(Reflect.get(target, property), value5)) {
    return true;
  }
  const result = Reflect.set(target, property, value5);
  if (result) {
    emit(reactive, typeof property === "string" ? length == null ? [property] : /^\d+$/.test(property) ? [Number.parseInt(property, 10)] : undefined : undefined);
    length?.set(target.length);
  }
  return result;
}

// src/reactive/object.ts
class ReactiveObject extends ReactiveInstance {
  constructor(type, value5, length) {
    super(type, value5);
    this.state.value = new Proxy(value5, {
      get: (target, key) => getProxyValue(this.state, target, key, length),
      set: (target, key, value6) => {
        return setProxyValue(this.state, target, key, value6, length);
      }
    });
  }
}

// src/reactive/signal.ts
function signal(value7) {
  return new Signal(value7);
}

class Signal extends ReactiveValue {
  constructor(value7) {
    super("signal", value7);
  }
  set(value7) {
    setValue(this.state, value7);
  }
  update(updater) {
    setValue(this.state, updater(this.state.value));
  }
}

// src/reactive/array.ts
function array(value8) {
  return new ReactiveArray(value8, signal(value8.length));
}

class ReactiveArray extends ReactiveObject {
  arrayLength;
  get length() {
    return this.arrayLength.get();
  }
  set length(value8) {
    this.state.value.length = value8 < 0 ? 0 : value8;
  }
  constructor(value8, arrayLength) {
    super("array", value8, arrayLength);
    this.arrayLength = arrayLength;
  }
  filter(callbackFn) {
    return computed(() => getValue(this.state).filter(callbackFn));
  }
  get(index) {
    return getValue(this.state, index);
  }
  insert(index, ...value8) {
    this.state.value.splice(index, 0, ...value8);
    return this.arrayLength?.peek();
  }
  map(callbackfn) {
    return computed(() => getValue(this.state).map(callbackfn));
  }
  peek(index) {
    return index == null ? [...this.state.value] : this.state.value.at(index);
  }
  push(...values) {
    return this.state.value.push(...values);
  }
  set(first, second) {
    if (Array.isArray(first)) {
      return this.state.value.splice(0, this.state.value.length, ...first);
    }
    this.state.value[first] = second;
  }
  splice(start, deleteCount, ...values) {
    return this.state.value.splice(start, deleteCount ?? 0, ...values);
  }
  subscribe(first, second) {
    return subscribeOrUnsubscribe("subscribe", this.state, first, second);
  }
  toArray() {
    return [...this.state.value];
  }
  unsubscribe(first, second) {
    subscribeOrUnsubscribe("unsubscribe", this.state, first, second);
  }
}
// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
function isPlainObject(value9) {
  if (typeof value9 !== "object" || value9 === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value9);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value9) && !(Symbol.iterator in value9);
}

// src/reactive/store.ts
function store(value9) {
  return new Store(value9);
}

class Store extends ReactiveObject {
  constructor(value9) {
    super("store", value9);
  }
  peek(key) {
    return key == null ? { ...this.state.value } : this.state.value[key];
  }
  set(first, second) {
    if (typeof first !== "object" && first !== null) {
      this.state.value[first] = second;
    }
  }
  subscribe(first, second) {
    return subscribeOrUnsubscribe("subscribe", this.state, first, second);
  }
  unsubscribe(first, second) {
    subscribeOrUnsubscribe("unsubscribe", this.state, first, second);
  }
}

// src/reactive/index.ts
function reactive(value9) {
  if (isReactive(value9)) {
    return value9;
  }
  switch (true) {
    case Array.isArray(value9):
      return array(value9);
    case isPlainObject(value9):
      return store(value9);
    case typeof value9 === "function":
      return computed(value9);
    case value9 == null:
    case primitives.has(typeof value9):
      return signal(value9);
    default:
      return value9;
  }
}
var primitives = new Set(["boolean", "number", "string"]);
export {
  store,
  signal,
  reactive,
  isStore,
  isSignal,
  isReactive,
  isEffect,
  isComputed,
  isArray,
  effect,
  computed,
  array
};
