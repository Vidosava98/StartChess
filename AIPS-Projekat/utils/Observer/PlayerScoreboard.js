// Concrete Observer
const TimerObserver = require('./TimerObserver');
class PlayerScoreboard extends TimerObserver {
    constructor(socket) {
        super();
        this.socket = socket;
    }
  
    update(timeRemaining) {
        this.socket.emit('updateTimer', { timeRemaining });
    }
  }
  module.exports = PlayerScoreboard