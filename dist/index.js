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
  const state = {
    callback,
    active: false,
    reactives: new Set
  };
  const instance = Object.create({
    start() {
      if (!state.active) {
        state.active = true;
        const index = globalThis._sentinels.push(state) - 1;
        state.callback();
        globalThis._sentinels.splice(index, 1);
      }
    },
    stop() {
      if (state.active) {
        state.active = false;
        for (const reactive of state.reactives) {
          reactive.callbacks.any.delete(state);
          for (const [key, keyed] of reactive.callbacks.values) {
            keyed.delete(state);
            if (keyed.size === 0) {
              reactive.callbacks.keys.delete(key);
            }
          }
        }
        state.reactives.clear();
      }
    }
  });
  Object.defineProperty(instance, "$sentinel", {
    value: "effect"
  });
  instance.start();
  return instance;
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
var isSentinel = function(value, expression) {
  return expression.test(value?.$sentinel ?? "");
};
function isStore(value) {
  return isSentinel(value, /^store$/i);
}
function isSignal(value) {
  return isSentinel(value, /^signal$/i);
}
// src/helpers/event.ts
function disable(state) {
  if (state.active) {
    state.active = false;
    for (const callback of state.callbacks.any) {
      if (typeof callback !== "function") {
        callback.reactives.delete(state);
      }
    }
    for (const [, callback] of state.callbacks.values) {
      for (const value of callback) {
        if (typeof value !== "function") {
          value.reactives.delete(state);
        }
      }
    }
  }
}
function emit(state, keys) {
  if (state.active) {
    const keyed = [];
    for (const [key, value] of state.callbacks.values) {
      if (keys == null || keys.includes(key)) {
        keyed.push(...value);
      }
    }
    const callbacks = [...state.callbacks.any, ...keyed].map((value) => typeof value === "function" ? value : value.callback);
    for (const callback of callbacks) {
      if (typeof callback === "function") {
        queue(() => {
          callback(state.value);
        });
      } else {
        queue(callback);
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
    return () => {
    };
  }
  set.add(subscriber);
  subscriber(state.value);
  return () => {
    unsubscribe(state, subscriber, key);
  };
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

// src/reactive/value.ts
function reactiveValue(value2) {
  const state = {
    value: value2,
    active: true,
    callbacks: {
      any: new Set,
      keys: new Set,
      values: new Map
    }
  };
  const callbacks = {
    get() {
      return getValue(state);
    },
    peek() {
      return state.value;
    },
    toJSON() {
      return getValue(state);
    },
    toString() {
      return String(getValue(state));
    },
    run() {
      enable(state);
    },
    stop() {
      disable(state);
    },
    subscribe(subscriber) {
      return subscribe(state, subscriber);
    },
    unsubscribe(subscriber) {
      if (subscriber == null) {
        state.callbacks.any.clear();
      } else {
        state.callbacks.any.delete(subscriber);
      }
    }
  };
  return {
    callbacks,
    state
  };
}

// src/reactive/computed.ts
function computed(value4) {
  const original = reactiveValue(undefined);
  const fx = effect(() => setValue(original.state, value4()));
  const instance = Object.create({
    ...original.callbacks,
    run() {
      fx.start();
    },
    stop() {
      fx.stop();
    }
  });
  Object.defineProperty(instance, "$sentinel", {
    value: "computed"
  });
  return instance;
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

// src/reactive/signal.ts
function signal(value7) {
  const original = reactiveValue(value7);
  function set(value8) {
    setValue(original.state, value8);
  }
  function update(updater) {
    setValue(original.state, updater(original.state.value));
  }
  const instance = Object.create({
    ...original.callbacks,
    set,
    update
  });
  Object.defineProperty(instance, "$sentinel", {
    value: "signal"
  });
  return instance;
}

// src/reactive/object.ts
var setArrayValue = function(state, first, second) {
  if (Array.isArray(first)) {
    return state.value.splice(0, state.value.length, ...first);
  }
  state.value[first] = second;
};
var setStoreValue = function(state, first, second) {
  if (typeof first !== "object" && first !== null) {
    state.value[first] = second;
  }
};
function reactiveObject(value9) {
  const isArray2 = Array.isArray(value9);
  const length = isArray2 ? signal(value9.length) : undefined;
  const original = reactiveValue(isArray2 ? [] : {});
  original.state.value = new Proxy(value9, {
    get: (target, key) => getProxyValue(original.state, target, key, length),
    set: (target, key, value10) => {
      return setProxyValue(original.state, target, key, value10, length);
    }
  });
  const callbacks = {
    ...original.callbacks,
    get(property) {
      return getValue(original.state, property);
    },
    peek(property) {
      if (property == null) {
        return isArray2 ? [...original.state.value] : { ...original.state.value };
      }
      return isArray2 ? original.state.value.at(property) : original.state.value[property];
    },
    set(first, second) {
      if (isArray2) {
        return setArrayValue(original.state, first, second);
      }
      setStoreValue(original.state, first, second);
    },
    subscribe(first, second) {
      const firstIsSubscriber = typeof first === "function";
      return subscribe(original.state, firstIsSubscriber ? first : second, firstIsSubscriber ? undefined : first);
    },
    unsubscribe(first, second) {
      const firstIsSubscriber = typeof first === "function";
      return unsubscribe(original.state, firstIsSubscriber ? first : second, firstIsSubscriber ? undefined : first);
    }
  };
  return {
    callbacks,
    length,
    state: original.state
  };
}

// src/reactive/array.ts
function array(value10) {
  const original = reactiveObject(value10);
  const instance = Object.create({
    ...original.callbacks,
    filter(callbackFn) {
      return computed(() => getValue(original.state).filter(callbackFn));
    },
    insert(index, ...value11) {
      original.state.value.splice(index, 0, ...value11);
      return original.length?.peek();
    },
    map(callbackfn) {
      return computed(() => getValue(original.state).map(callbackfn));
    },
    push(...values) {
      return original.state.value.push(...values);
    },
    splice(start, deleteCount, ...values) {
      return original.state.value.splice(start, deleteCount ?? 0, ...values);
    },
    toArray() {
      return original.state.value.slice();
    }
  });
  Object.defineProperties(instance, {
    $sentinel: {
      value: "array"
    },
    length: {
      get() {
        return original.length?.get();
      },
      set(value11) {
        original.state.value.length = value11 < 0 ? 0 : value11;
      }
    }
  });
  return instance;
}
// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
var isPlainObject = function(value10) {
  if (typeof value10 !== "object" || value10 === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value10);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value10) && !(Symbol.iterator in value10);
};

// src/reactive/index.ts
function reactive(value10) {
  if (isReactive(value10)) {
    return value10;
  }
  switch (true) {
    case Array.isArray(value10):
      return array(value10);
    case typeof value10 === "function":
      return computed(value10);
    case value10 == null:
    case isPlainObject(value10):
    case primitives.has(typeof value10):
      return signal(value10);
    default:
      return value10;
  }
}
var primitives = new Set(["boolean", "number", "string"]);
// src/reactive/store.ts
function store(value10) {
  const original = reactiveObject(value10);
  const instance = Object.create({
    ...original.callbacks
  });
  Object.defineProperty(instance, "$sentinel", {
    get() {
      return "store";
    }
  });
  return instance;
}
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
