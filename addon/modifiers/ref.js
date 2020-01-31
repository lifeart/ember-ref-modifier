import { set, get } from '@ember/object';
import { assert } from '@ember/debug';
import { setModifierManager, capabilities } from '@ember/modifier';
import { next } from '@ember/runloop';
function hasValidTarget(target) {
  return (
    typeof target === 'object' && target !== null && !Array.isArray(target)
  );
}
function hasValidProperty(prop) {
  return typeof prop === 'string';
}
function getParams([target, propName]) {
  if (typeof target === 'function') {
    return {
      cb: target
    };
  }
  assert(
    `String ${target} used as context for ref modifier. Should be {{ref context "${target}"}}. You passed {{ref "${target}" context}}`,
    typeof target !== 'string'
  );
  return { target, propName };
}

export default setModifierManager(
  () => ({
    capabilities: capabilities ? capabilities('3.13') : undefined,
    createModifier() {
      return {
        element: undefined,
        propName: undefined,
        cb: undefined,
        target: undefined
      };
    },

    installModifier(state, element, { positional }) {
      const { propName, target, cb } = getParams(positional);
      if (cb) {
        state.cb = cb;
        this._runInContext(cb, element);
        return;
      }
      if (hasValidProperty(propName) && hasValidTarget(target)) {
        this._setInContext(target, propName, element);
        state.propName = propName;
        state.target = target;
      }
      state.element = element;
    },

    updateModifier(state, { positional }) {
      const { propName, target, cb } = getParams(positional);
      if (cb) {
        state.cb = cb;
        this._runInContext(cb, state.element);
        return;
      }
      if (hasValidProperty(propName) && hasValidTarget(target)) {
        if (hasValidProperty(state.propName) && hasValidTarget(state.target)) {
          if (get(target, propName) !== get(state.target, state.propName)) {
            this._setInContext(state.target, state.propName, null);
          }
        }
        this._setInContext(target, propName, state.element);
        state.propName = propName;
        state.target = target;
      }
    },
    _setInContext(target, propName, value) {
      next(this, '_setValues', target, propName, value);
    },
    _runInContext(cb, value) {
      next(this, '_runCb', cb, value);
    },
    _runCb(cb, value) {
      cb(value);
    },
    _setValues(target, propName, value) {
      if (target.isDestroyed || target.isDestroying) {
        return;
      }
      set(target, propName, value);
    },
    destroyModifier({ target, propName, cb }) {
      if (cb) {
        return;
      }
      if (hasValidProperty(propName) && hasValidTarget(target)) {
        this._setInContext(target, propName, null);
      }
    }
  }),
  class RefModifier {}
);
