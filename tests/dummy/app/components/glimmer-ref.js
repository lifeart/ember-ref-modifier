import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class GlimmerRefComponent extends Component {
  @tracked
  node = null;
  get size() {
    return this.node && this.node.clientWidth;
  }
}
