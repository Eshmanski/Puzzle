import Puzle from './Puzle';
import Mediator from './Mediator';

const mediator = new Mediator();

const puzle = new Puzle('.root', mediator);
puzle.init();