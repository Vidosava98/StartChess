// Invoker
class Invoker {
    constructor() {
      this.command = null;
    }
  
    setCommand(command) {
      this.command = command;
    }
  
    pozoviKonkretnuKomandu() {
      this.command.execute();
    }
  }
  
  module.exports = Invoker