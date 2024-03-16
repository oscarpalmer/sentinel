// src/is.ts
function isComputed(value) {
  return isInstance(/^computed$/i, value);
}
function isEffect(value) {
  return isInstance(/^effect$/i, value);
}
var isInstance = function(expression, value) {
  return expression.test(value?.constructor?.name) && value.sentinel === true;
};
function isReactive(value) {
  return isComputed(value) || isSignal(value);
}
function isSignal(value) {
  return isInstance(/^signal$/i, value);
}
export {
  isSignal,
  isReactive,
  isEffect,
  isComputed
};
