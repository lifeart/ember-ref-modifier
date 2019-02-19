import Ember from 'ember';
import { set, get } from '@ember/object';

function hasValidTarget(target) {
  return (
    typeof target === 'object' && target !== null && !Array.isArray(target)
  );
}
function hasValidProperty(prop) {
  return typeof prop === 'string';
}

export default Ember._setModifierManager(
  () => ({
    createModifier() {
      return {
        element: undefined,
        propName: undefined,
        target: undefined
      };
    },

    installModifier(
      state,
      element,
      {
        positional: [propName, target]
      }
    ) {
      if (hasValidProperty(propName) && hasValidTarget(target)) {
        set(target, propName, element);
        state.propName = propName;
        state.target = target;
      }
      state.element = element;
    },

    updateModifier(
      state,
      {
        positional: [propName, target]
      }
    ) {
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
  class OnModifier {}
);
