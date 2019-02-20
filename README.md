# ember-ref-modifier

[![Greenkeeper badge](https://badges.greenkeeper.io/lifeart/ember-ref-modifier.svg)](https://greenkeeper.io/)

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
<button {{ref "button" this}} data-name="foo">
  Click me baby, one more time!
</button>

{{this.button.dataset.name}} >> "foo"
```

```hbs
<div {{ref "divContainer" this}}></div>
{{#-in-element this.divContainer}}
  Hello!
{{/-in-element}}
```

```hbs
{{#let (hash) as |ctx|}}
	<input id="name-input" {{ref 'inputNode' ctx}}>
	<label for={{ctx.inputNode.id}}> Enter your name </label>
{{/let}}
```



------

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
