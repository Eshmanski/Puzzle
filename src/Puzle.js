import Display from './Display';
import Form from './Form';

class Puzle {
  constructor(className, mediator) {
    this.mediator = mediator;
    this.$el = document.createElement('div');
    this.$el.className = 'app'
    this.root = document.querySelector(className);
  }

  init() {
    const display = new Display(this.mediator);
    display.init(this.$el);

    const form = new Form(this.mediator);
    form.init(this.$el);

    this.root.insertAdjacentElement('afterbegin', this.$el)
  }
}

export default Puzle;