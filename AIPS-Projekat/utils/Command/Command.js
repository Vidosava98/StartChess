// Command interface
class Command {
    execute() {
      throw new Error('execute() mora biti implementirna');
    }
  
    undo() {
      throw new Error('undo() mora biti implementirana');
    }
  }
  module.exports = Command



  