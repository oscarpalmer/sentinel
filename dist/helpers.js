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
if (globalThis._atomic_effects === undefined) {
  const queued = new Set;
  Object.defineProperty(globalThis, "_atomic_queued", {
    get() {
      return queued;
    }
  });
}

// src/helpers.ts
function getValue(value) {
  const effect = globalThis._sentinels[globalThis._sentinels.length - 1];
  if (effect != null) {
    value.effects.add(effect);
    effect.values.add(value);
  }
  return value._value;
}
function setValue(reactive, value, run) {
  if (!run && Object.is(reactive._value, value)) {
    return;
  }
  reactive._value = value;
  if (reactive.active) {
    for (const effect of reactive.effects) {
      queue(effect.callback);
    }
  }
}
export {
  setValue,
  getValue
};
