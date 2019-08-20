import { set, get } from '@ember/object';
import { deprecate } from '@ember/application/deprecations';
import { setModifierManager, capabilities } from '@ember/modifier';

function hasValidTarget(target) {
  return (
    typeof target === 'object' && target !== null && !Array.isArray(target)
  );
}
function hasValidProperty(prop) {
  return typeof prop === 'string';
}
function getParams([maybeTarget, maybePropName]) {
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
        target: undefined
      };
    },

    installModifier(state, element, { positional }) {
      const { propName, target } = getParams(positional);
      if (hasValidProperty(propName) && hasValidTarget(target)) {
        set(target, propName, element);
        state.propName = propName;
        state.target = target;
      }
      state.element = element;
    },

    updateModifier(state, { positional }) {
      const { propName, target } = getParams(positional);
      if (hasValidProperty(propName) && hasValidTarget(target)) {
        if (hasValidProperty(state.propName) && hasValidTarget(state.target)) {
          if (get(target, propName) !== get(state.target, state.propName)) {
            set(state.target, state.propName, null);
          }
        }
        set(target, propName, state.element);
        state.propName = propName;
        state.target = target;
      }
    },

    destroyModifier({ target, propName }) {
      if (hasValidProperty(propName) && hasValidTarget(target)) {
        set(target, propName, null);
      }
    }
  }),
  class RefModifier {}
);
