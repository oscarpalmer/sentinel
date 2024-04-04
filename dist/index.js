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
function getProxyValue(reactive, target, property, length) {
  if (arrayOperations.has(property)) {
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

// src/reactive/list.ts
function list(value9) {
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
    at(index) {
      return original.state.value.at(index);
    },
    get(property) {
      return property == null ? getValue(original.state) : original.state.value[property];
    },
    map(callbackfn) {
      return computed(() => getValue(original.state).map(callbackfn));
    },
    peek(property) {
      return property == null ? original.state.value : original.state.value[property];
    },
    push(...values) {
      return original.state.value.push(...values);
    },
    set(property, value10) {
      original.state.value[property] = value10;
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

// src/reactive/index.ts
function reactive(value9) {
  if (isReactive(value9)) {
    return value9;
  }
  switch (true) {
    case Array.isArray(value9):
      return list(value9);
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
  list,
  isSignal,
  isReactive,
  isList,
  isEffect,
  isComputed,
  effect,
  computed
};
