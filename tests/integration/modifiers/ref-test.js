import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Modifier | ref', function(hooks) {
  setupRenderingTest(hooks);

  test('it basically works: legacy', async function(assert) {
    assert.expect(1);

    await render(
      hbs`<button data-foo="some-thing" {{ref 'btn' this}}></button>`
    );
    assert.equal(this.btn.dataset.foo, 'some-thing');
  });

  test('it basically works', async function(assert) {
    assert.expect(1);

    await render(
      hbs`<button data-foo="some-thing" {{ref this 'btn'}}></button>`
    );
    assert.equal(this.btn.dataset.foo, 'some-thing');
  });

  test('it is re-registered, when attrs changed: legacy', async function(assert) {
    assert.expect(3);

    await render(
      hbs`<button data-foo="some-thing"  {{ref 'btn' this}}></button>`
    );

    assert.equal(this.btn.dataset.foo, 'some-thing');

    await render(
      hbs`<button data-foo="some-thing"  {{ref 'btns' this}}></button>`
    );

    assert.equal(this.btn, null);
    assert.equal(this.btns.dataset.foo, 'some-thing');
  });

  test('it is re-registered, when attrs changed', async function(assert) {
    assert.expect(3);

    await render(
      hbs`<button data-foo="some-thing"  {{ref this 'btn'}}></button>`
    );

    assert.equal(this.btn.dataset.foo, 'some-thing');

    await render(
      hbs`<button data-foo="some-thing"  {{ref this 'btns'}}></button>`
    );

    assert.equal(this.btn, null);
    assert.equal(this.btns.dataset.foo, 'some-thing');
  });

  test('it does nothing if ref key or target `null` or `undefined`: legacy', async function(assert) {
    assert.expect(0);
    await render(hbs`
      <button data-foo="some-thing" {{ref 'click' null}}></button>
      <button data-foo="some-thing" {{ref 'click' undefined}}></button>
      <button data-foo="some-thing" {{ref  null 'click'}}></button>
      <button data-foo="some-thing" {{ref  undefined click}}></button>
      <button data-foo="some-thing" {{ref  null null}}></button>
      <button data-foo="some-thing" {{ref  undefined undefined}}></button>
    `);
  });

  test('it does nothing if ref key or target `null` or `undefined`', async function(assert) {
    assert.expect(0);
    await render(hbs`
      <button data-foo="some-thing" {{ref null 'click'}}></button>
      <button data-foo="some-thing" {{ref undefined 'click'}}></button>
      <button data-foo="some-thing" {{ref 'click' null}}></button>
      <button data-foo="some-thing" {{ref  click undefined}}></button>
      <button data-foo="some-thing" {{ref  null null}}></button>
      <button data-foo="some-thing" {{ref  undefined undefined}}></button>
    `);
  });

  test('it does not crash when updating to or from `null` / `undefined`: legacy', async function(assert) {
    assert.expect(2);

    this.set('ctx', null);
    await render(hbs`<button {{ref 'btn' this.ctx}}></button>`);

    assert.equal(this.btn, undefined);
    this.set('ctx', this);

    assert.equal(this.btn.tagName, 'BUTTON');
  });

  test('it does not crash when updating to or from `null` / `undefined`', async function(assert) {
    assert.expect(2);

    this.set('ctx', null);
    await render(hbs`<button {{ref this.ctx 'btn'}}></button>`);

    assert.equal(this.btn, undefined);
    this.set('ctx', this);

    assert.equal(this.btn.tagName, 'BUTTON');
  });

  test('it works when using the let helper', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#let (hash) as |ctx|}}
        <div {{ref ctx 'firstDiv'}} id='first-div'></div>
        <div id='second-div'>{{ctx.firstDiv.id}}</div>
      {{/let}}
    `);

    assert.dom('#second-div').hasText(find('#first-div').id);
  });
});
