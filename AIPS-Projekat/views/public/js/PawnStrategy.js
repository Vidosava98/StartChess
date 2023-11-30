import { ChessPieceStrategy } from './ChessPieceStrategy.js';
import { colorInGreen, colorInRed, listaDozvoljenihPoteza } from './socket.js';

class PawnStrategy extends ChessPieceStrategy {
  dozvoljeniPotezi(xx, yy) {
    let list = [];
    let newX = null;
    let newY = null;
    const klasaSlike = document.querySelector('[data-x="'+ xx +'"][data-y="' + yy + '"]').children[0].getAttribute("class"); 
    let elementiSlikeFigure = klasaSlike.split("_");
    let listFirstMoveB = [{x:0,y:1},{x:1,y:1},{x:2,y:1},{x:3,y:1},{x:4,y:1},{x:5,y:1},{x:6,y:1},{x:7,y:1}];
    let listFirstMoveW = [{x:0,y:6},{x:1,y:6},{x:2,y:6},{x:3,y:6},{x:4,y:6},{x:5,y:6},{x:6,y:6},{x:7,y:6}];
    if(elementiSlikeFigure[0].toString() === "B" )
    {   
       newX = xx;
       newY = yy + 1;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          list.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          listFirstMoveB.forEach((element) => {
            if(element.x === xx && element.y === yy){
              newX = xx;
              newY = yy + 2;
              field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
              if(field){
                if(!field.children[0]){
                  list.push({x:newX,y:newY});
                  listaDozvoljenihPoteza.push({x:newX,y:newY});
                  }
              }
            }
          })
          }
      }
    }
    else if(elementiSlikeFigure[0].toString() === "W"){
       newX = xx;
       newY = yy - 1;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          list.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          listFirstMoveW.forEach((element) => {
            if(element.x === xx && element.y === yy){
              newX = xx;
              newY = yy - 2;
              field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
              if(field){
                if(!field.children[0]){
                  list.push({x:newX,y:newY});
                  listaDozvoljenihPoteza.push({x:newX,y:newY});
                  }
              }
            }
          })
          }
      }
    }
    colorInGreen(list);
    list = [];
    if(elementiSlikeFigure[0].toString() === "B" )
    {         
      //left
      newX = xx - 1;
      newY = yy + 1;
     let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
     let klasaFigure = [];
     if(field){
      if(field.children[0])
     {
     klasaFigure =  field.children[0].getAttribute("class").split("_");
     if(newX > -1 && newY < 8 && klasaFigure[0].toString() === "W" ){
     list.push({x:newX,y:newY});
     listaDozvoljenihPoteza.push({x:newX,y:newY}); }
     }
     }
     //right
     newX = xx + 1;
     newY = yy + 1;
     field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
     if(field){
      if(field.children[0])
     {
      klasaFigure =  field.children[0].getAttribute("class").split("_");
      if(newX < 8 && newY < 8 && klasaFigure[0].toString() === "W"){
        list.push({x:newX,y:newY});
        listaDozvoljenihPoteza.push({x:newX,y:newY}); }
     }
     }
    }
    else if(elementiSlikeFigure[0].toString() === "W")
    {

      //left
       newX = xx - 1;
       newY = yy - 1;
       let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
       let klasaFigure = [];
      if(field){
        if(field.children[0]){
          klasaFigure =  field.children[0].getAttribute("class").split("_");
          if(newX > -1 && newY > -1 && klasaFigure[0].toString() === "B" ){
          list.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }
          }
      }
      //right
      newX = xx + 1;
      newY = yy - 1;
      field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(field.children[0]){
          klasaFigure =  field.children[0].getAttribute("class").split("_");
          if(newX < 8 && newY > -1 && klasaFigure[0].toString() === "B"){
          list.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }
          }
      }
    }
    colorInRed(list);
  }
}
export {PawnStrategy};
