// src/models.ts
if (globalThis._sentinels === undefined) {
  const watchers = [];
  Object.defineProperty(globalThis, "_sentinels", {
    get() {
      return watchers;
    }
  });
}

class Sentinel {
  active;
  sentinel = true;
  constructor(active) {
    this.active = active;
  }
}

// src/watcher.ts
function watch(callback) {
  return new Watcher(callback);
}

class Watcher extends Sentinel {
  callback;
  values = new Set;
  constructor(callback) {
    super(false);
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
      value.watchers.delete(this);
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

// src/helpers.ts
function emitValue(reactive) {
  if (reactive.active) {
    for (const watcher of reactive.watchers) {
      queue(watcher.callback);
    }
  }
}
function getValue(reactive) {
  const watcher = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (watcher != null) {
    reactive.watchers.add(watcher);
    watcher.values.add(reactive);
  }
  return reactive._value;
}
function setValue(reactive, value) {
  if (Object.is(reactive._value, value)) {
    return;
  }
  reactive._value = value;
  emitValue(reactive);
}
function startReactivity(reactive) {
  if (reactive.active) {
    return;
  }
  reactive.active = true;
  emitValue(reactive);
}
function stopReactivity(reactive) {
  if (!reactive.active) {
    return;
  }
  reactive.active = false;
  for (const watcher of reactive.watchers) {
    watcher.values.delete(reactive);
  }
}

// src/reactive.ts
class ReactiveValue extends Sentinel {
  _value;
  watchers = new Set;
  constructor(_value) {
    super(true);
    this._value = _value;
  }
  get() {
    return this.value;
  }
  peek() {
    return this._value;
  }
  toJSON() {
    return this.value;
  }
  toString() {
    return String(this.value);
  }
}

// src/computed.ts
function computed(callback) {
  return new Computed(callback);
}

class Computed extends ReactiveValue {
  watcher;
  get value() {
    return getValue(this);
  }
  constructor(callback) {
    super(undefined);
    this.watcher = new Watcher(() => setValue(this, callback()));
  }
  run() {
    this.watcher.start();
  }
  stop() {
    this.watcher.stop();
  }
}
// src/is.ts
function isComputed(value) {
  return isInstance(/^computed$/i, value);
}
var isInstance = function(expression, value) {
  return expression.test(value?.constructor?.name) && value.sentinel === true;
};
function isList(value) {
  return isInstance(/^list$/i, value);
}
function isReactive(value) {
  return isComputed(value) || isSignal(value);
}
function isSignal(value) {
  return isInstance(/^signal$/i, value);
}
function isWatcher(value) {
  return isInstance(/^watcher$/i, value);
}
// src/list.ts
function list(value) {
  return new List(value);
}
var operation = function(list2, array, operation2) {
  return (...args) => {
    const result = array[operation2](...args);
    emitValue(list2);
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

class List extends ReactiveValue {
  get value() {
    return getValue(this);
  }
  constructor(value) {
    super(new Proxy(value, {
      get: (target, property) => {
        return operations.has(property) ? operation(this, target, property) : Reflect.get(target, property);
      },
      set: (target, property, value2) => {
        const result = Reflect.set(target, property, value2);
        if (result) {
          emitValue(this);
        }
        return result;
      }
    }));
  }
  run() {
    startReactivity(this);
  }
  stop() {
    stopReactivity(this);
  }
}
// src/signal.ts
function signal(value) {
  return new Signal(value);
}

class Signal extends ReactiveValue {
  constructor() {
    super(...arguments);
  }
  get value() {
    return getValue(this);
  }
  set value(value) {
    setValue(this, value);
  }
  run() {
    startReactivity(this);
  }
  set(value) {
    setValue(this, value);
  }
  stop() {
    stopReactivity(this);
  }
}
export {
  watch,
  signal,
  list,
  isWatcher,
  isSignal,
  isReactive,
  isList,
  isComputed,
  computed
};
