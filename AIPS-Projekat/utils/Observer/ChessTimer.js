// Subject 
class ChessTimer {
    constructor(initialTime, s, m, h) {
        this.timeRemaining = initialTime;
        this.observers = [];
        this.intervalId = null;
        this.s = parseInt(s);
        this.m = parseInt(m);
        this.h = parseInt(h);
    }
  
    addTimerObserver(observer) {
        this.observers.push(observer);
    }
  
    removeTimerObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
  
    startTimer() {
        this.intervalId = setInterval(() => {
            this.notifyObservers();
            this.s = this.s + 1;
            if(this.s > 60){
              this.s = 0;
              this.m = this.m + 1;
              if(this.m > 60)
              {
              this.m = 0;
              this.h = this.h + 1
              }
            }
            const hh = (this.h<10) ? "0" + this.h : this.h; 
            const mm = (this.m<10) ? "0" + this.m : this.m; 
            const ss = (this.s<10) ? "0" + this.s : this.s; 
            this.timeRemaining =  hh + ":" + mm + ":" + ss;
        }, 1000);
    }
  
    stopTimer() {
        clearInterval(this.intervalId);
        this.notifyObservers();
    }
  
    notifyObservers() {
        for (const observer of this.observers) {
            observer.update(this.timeRemaining);
        }
    }
  }
module.exports = ChessTimer