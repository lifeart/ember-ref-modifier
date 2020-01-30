import { set, get } from '@ember/object';
import { deprecate } from '@ember/application/deprecations';
import { setModifierManager, capabilities } from '@ember/modifier';
import { run } from '@ember/runloop';
function hasValidTarget(target) {
  return (
    typeof target === 'object' && target !== null && !Array.isArray(target)
  );
}
function hasValidProperty(prop) {
  return typeof prop === 'string';
}
function getParams([maybeTarget, maybePropName]) {
  if (typeof maybeTarget === 'function') {
    return {
      cb: maybeTarget
    };
  }
  const isPropNameString = typeof maybePropName === 'string';
  if (!isPropNameString) {
    deprecate(
      'ember-ref-modifier: {{ref "propertyName" context}} has been changed to {{ref context "propertyName"}}. Please migrate to use this.',
      false,
      {
        id: '@ember-ref-modifier--arguments-ordering-deprecation',
        until: 'v1.0.0'
      }
    );
  }
  return {
    propName: isPropNameString ? maybePropName : maybeTarget,
    target: isPropNameString ? maybeTarget : maybePropName
  };
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
        this._runInContext(cb, element);
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
      run(this, '_setValues', target, propName, value);
    },
    _runInContext(cb, value) {
      run(this, '_runCb', cb, value);
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
