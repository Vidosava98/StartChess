class ChessPieceContext {
     constructor(strategy) {
      this.strategy = strategy;
    }
  
    setStrategy(strategy) {
      this.strategy = strategy;
    }
  
    dozvoljeniPotezi(x, y) {
      this.strategy.dozvoljeniPotezi(parseInt(x), parseInt(y));
    }
  }
  export {ChessPieceContext};