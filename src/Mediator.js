class Mediator {
  constructor() {
    this.methodsList = {};
  }

  addMethod(nameMethod, method) {
    this.methodsList[nameMethod] = method;
  }

  callMethod(nameMethod, ...args) {
    this.methodsList[nameMethod](...args);
  }
}

export default Mediator;