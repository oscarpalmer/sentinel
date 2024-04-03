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
          reactive.effects.delete(state);
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
function watch(reactive) {
  const effect2 = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect2 != null) {
    reactive.effects.add(effect2);
    effect2.reactives.add(reactive);
  }
}
// src/helpers/is.ts
function isComputed(value) {
  return isSentinel(value, /^computed$/i);
}
function isEffect(value) {
  return isSentinel(value, /^effect$/i);
}
function isList(value) {
  return isSentinel(value, /^list$/i);
}
function isReactive(value) {
  return isSentinel(value, /^computed|list|signal|store$/i);
}
var isSentinel = function(value, expression) {
  return expression.test(value?.$sentinel ?? "");
};
function isSignal(value) {
  return isSentinel(value, /^signal$/i);
}
function isStore(value) {
  return isSentinel(value, /^store$/i);
}
// src/helpers/event.ts
function disable(state) {
  if (state.active) {
    state.active = false;
    for (const effect2 of state.effects) {
      effect2.reactives.delete(state);
    }
  }
}
function emit(state) {
  if (state.active) {
    const { effects, subscribers } = state;
    const callbacks = [...effects, ...subscribers.values()].map((value) => typeof value === "function" ? value : value.callback);
    for (const callback of callbacks) {
      queue(callback);
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
function getValue(reactive) {
  watch(reactive);
  return reactive.value;
}
function setValue(reactive, value) {
  if (!Object.is(reactive.value, value)) {
    reactive.value = value;
    emit(reactive);
  }
}
function updateArray(reactive, array, operation, length) {
  return (...args) => {
    const result = array[operation](...args);
    emit(reactive);
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
function reactiveValue(value2) {
  const state = {
    value: value2,
    active: true,
    effects: new Set,
    subscribers: new Map
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
      const { subscribers, value: value3 } = state;
      if (subscribers.has(subscriber)) {
        return () => {
        };
      }
      subscribers.set(subscriber, () => subscriber(value3));
      subscriber(value3);
      return () => {
        state.subscribers.delete(subscriber);
      };
    },
    unsubscribe(subscriber) {
      state.subscribers.delete(subscriber);
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
// node_modules/@oscarpalmer/atoms/dist/js/is.mjs
var isPlainObject = function(value4) {
  if (typeof value4 !== "object" || value4 === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value4);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value4) && !(Symbol.iterator in value4);
};

// src/helpers/proxy.ts
function getProxyValue(reactive, target, property, isArray, length) {
  if (isArray && arrayOperations.has(property)) {
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
    emit(reactive);
    length?.set(target.length);
  }
  return result;
}

// src/reactive/object.ts
function reactiveObject(value7, length) {
  const original = reactiveValue(Array.isArray(value7) ? [] : {});
  original.state.value = new Proxy(value7, {
    get(target, property) {
      return getProxyValue(original.state, target, property, Array.isArray(target), length);
    },
    set(target, property, value8) {
      return setProxyValue(original.state, target, property, value8, length);
    }
  });
  function get(property) {
    return property == null ? getValue(original.state) : original.state.value[property];
  }
  function peek(property) {
    return property == null ? original.state.value : original.state.value[property];
  }
  function set(property, value8) {
    original.state.value[property] = value8;
  }
  return {
    callbacks: { ...original.callbacks, get, peek, set },
    state: original.state
  };
}

// src/reactive/signal.ts
function signal(value9) {
  const original = reactiveValue(value9);
  function set(value10) {
    setValue(original.state, value10);
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

// src/reactive/list.ts
function list(value9) {
  const length = signal(value9.length);
  const original = reactiveObject(value9, length);
  const instance = Object.create({
    ...original.callbacks,
    at(index) {
      return original.state.value.at(index);
    },
    map(callbackfn) {
      return computed(() => original.state.value.map(callbackfn));
    },
    push(...values) {
      return original.state.value.push(...values);
    },
    splice(start, deleteCount, ...values) {
      return original.state.value.splice(start, deleteCount ?? 0, ...values);
    }
  });
  Object.defineProperties(instance, {
    $sentinel: {
      value: "list"
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

// src/reactive/store.ts
function store(value9) {
  const instance = Object.create(reactiveObject(value9).callbacks);
  Object.defineProperty(instance, "$sentinel", {
    value: "store"
  });
  return instance;
}

// src/reactive/index.ts
function reactive(value9) {
  if (value9 == null || isReactive(value9)) {
    return value9;
  }
  switch (true) {
    case Array.isArray(value9):
      return list(value9);
    case isPlainObject(value9):
      return store(value9);
    case typeof value9 === "function":
      return computed(value9);
    case ["boolean", "number", "string"].includes(typeof value9):
      return signal(value9);
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
