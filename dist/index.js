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
          for (const [, keyed] of reactive.callbacks.values) {
            keyed.delete(state);
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

// src/helpers/proxy.ts
function getProxyValue(reactive, target, property, length) {
  if (arrayOperations.has(property)) {
    return updateArray(reactive, target, property, length);
  }
  const value2 = Reflect.get(target, property);
  return isReactive(value2) ? value2.get() : value2;
}
function setProxyValue(reactive, target, property, value2, length) {
  if (Object.is(Reflect.get(target, property), value2)) {
    return true;
  }
  const result = Reflect.set(target, property, value2);
  if (result) {
    emit(reactive, typeof property === "string" && /^\d+$/.test(property) ? [Number.parseInt(property, 10)] : undefined);
    length?.set(target.length);
  }
  return result;
}

// src/reactive/value.ts
function reactiveValue(value3) {
  const state = {
    value: value3,
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
      const { callbacks: callbacks2, value: value4 } = state;
      if (callbacks2.any.has(subscriber)) {
        return () => {
        };
      }
      callbacks2.any.add(subscriber);
      subscriber(value4);
      return () => {
        state.callbacks.any.delete(subscriber);
      };
    },
    unsubscribe(subscriber) {
      state.callbacks.any.delete(subscriber);
    }
  };
  return {
    callbacks,
    state
  };
}

// src/reactive/computed.ts
function computed(value5) {
  const original = reactiveValue(undefined);
  const fx = effect(() => setValue(original.state, value5()));
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

// src/reactive/array.ts
function array(value9) {
  const length = signal(value9.length);
  const original = reactiveValue([]);
  original.state.value = new Proxy(value9, {
    get(target, property) {
      return getProxyValue(original.state, target, property, length);
    },
    set(target, property, value10) {
      return setProxyValue(original.state, target, property, value10, length);
    }
  });
  const instance = Object.create({
    ...original.callbacks,
    filter(callbackFn) {
      return computed(() => getValue(original.state).filter(callbackFn));
    },
    get(property) {
      return property == null ? getValue(original.state) : getValue(original.state, property);
    },
    insert(index, ...value10) {
      original.state.value.splice(index, 0, ...value10);
      return length.peek();
    },
    map(callbackfn) {
      return computed(() => getValue(original.state).map(callbackfn));
    },
    peek(property) {
      return property == null ? original.state.value : original.state.value.at(property);
    },
    push(...values) {
      return original.state.value.push(...values);
    },
    set(first, second) {
      if (Array.isArray(first)) {
        return original.state.value.splice(0, original.state.value.length, ...first);
      }
      original.state.value[first] = second;
    },
    splice(start, deleteCount, ...values) {
      return original.state.value.splice(start, deleteCount ?? 0, ...values);
    }
  });
  Object.defineProperties(instance, {
    $sentinel: {
      value: "array"
    },
    length: {
      get() {
        return length.get();
      },
      set(value10) {
        original.state.value.length = value10 < 0 ? 0 : value10;
      }
    }
  });
  return instance;
}
// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
var isPlainObject = function(value9) {
  if (typeof value9 !== "object" || value9 === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value9);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value9) && !(Symbol.iterator in value9);
};

// src/reactive/index.ts
function reactive(value9) {
  if (isReactive(value9)) {
    return value9;
  }
  switch (true) {
    case Array.isArray(value9):
      return array(value9);
    case typeof value9 === "function":
      return computed(value9);
    case value9 == null:
    case isPlainObject(value9):
    case primitives.has(typeof value9):
      return signal(value9);
    default:
      return value9;
  }
}
var primitives = new Set(["boolean", "number", "string"]);
export {
  signal,
  reactive,
  isSignal,
  isReactive,
  isEffect,
  isComputed,
  isArray,
  effect,
  computed,
  array
};
