# ember-ref-modifier

An implementation of the `{{ref}}` element modifier. 
Heavily inspired by [ember-on-modifier](https://github.com/buschtoens/ember-on-modifier) and  [`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers).

## Installation

```
ember install ember-ref-modifier
```

#### Compatibility

- Ember.js v2.18 or above
- ember-cli v2.13 or above

## Usage

```hbs
<button {{ref "button" this}}>
  Click me baby, one more time!
</button>
```

```ts
import Component from '@ember/component';

export default class BritneySpearsComponent extends Component {
  button: DOMNode
}
```


This is essentially equivalent to:

```ts
didInsertElement() {
  super.didInsertElement();
  this.set('button', this.element.querySelector('button'));
}
```

It will also re-register property, if any of the passed parameters change.
