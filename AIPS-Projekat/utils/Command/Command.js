// Command interface
class Command {
    execute() {
      throw new Error('execute() must be implemented');
    }
  
    undo() {
      throw new Error('undo() must be implemented');
    }
  }
  module.exports = Command