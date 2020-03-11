# ember-ref-modifier

[![Greenkeeper badge](https://badges.greenkeeper.io/lifeart/ember-ref-modifier.svg)](https://greenkeeper.io/)

An implementation of the `{{ref}}` element modifier. 
Heavily inspired by [ember-on-modifier](https://github.com/buschtoens/ember-on-modifier) and  [`@ember/render-modifiers`](https://github.com/emberjs/ember-render-modifiers).

## Installation

```
ember install ember-ref-modifier
```

#### Compatibility

- Ember.js v3.13 or above
- ember-cli v2.13 or above

## Usage

```hbs
<button {{ref this "button"}} data-name="foo">
  Click me baby, one more time!
</button>

{{this.button.dataset.name}} >> "foo"
```

--------------------------

```hbs
<button {{ref this.callback}} data-name="foo">
  Click me baby, one more time!
</button>
```

```js
class Component {
	@action callback(node) {
		this.node = node;
	}
}

```

------------------------

```hbs
<div {{ref this "divContainer" }}></div>
{{#-in-element this.divContainer}}
  Hello!
{{/-in-element}}
```
------------------------


```hbs
// hash helper must return an EmberObject! The default hash helper returns a pojo.
{{#let (hash) as |ctx|}}
	<input id="name-input" {{ref ctx 'inputNode'}}>
	<label for={{ctx.inputNode.id}}> Enter your name </label>
{{/let}}
```


------------------------

------

```hbs
<button {{ref this "button"}}>
  Click me baby, one more time!
</button>
```

```ts
import Component from '@ember/component';

export default class BritneySpearsComponent extends Component {
  button!: DOMNode
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

## Updating a property twice in the same runloop

When you have `computed` or `@tracked` properties that depend on the `{{ref}}` value you may see the error message

```
Error: Assertion Failed: You attempted to update `prop` on `Class`,but it had already been used previously in the same computation.
```

You will need to update your `{{ref}}` to use a callback and manually declare a new runloop to set the property in.

```hbs
{{ref this.setProp}}
```

```javascript
import { next } from '@ember/runloop';
@action
setProp(element){
  //set 'prop' in the next runloop so it does not cause a re-rendering calculation
  run.next(()=> {
    this.prop = element
  });
}
```
