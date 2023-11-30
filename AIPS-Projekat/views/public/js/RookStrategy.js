import { ChessPieceStrategy } from './ChessPieceStrategy.js';
import { colorInGreen, colorInRed, listaDozvoljenihPoteza } from './socket.js';

class   RookStrategy extends ChessPieceStrategy {
  dozvoljeniPotezi(xx, yy) {
    let listZeleno = [];  
    let listCrveno = [];
    const mojField = document.querySelector('[data-x="'+ xx +'"][data-y="' + yy + '"]');
    const mojaKlasaFigure = mojField.children[0].getAttribute("class").split("_");
    let newX = null;
    let newY = null;

    for(let i = 1; i < 8; i++){
      //left
      newX = xx - i;
      newY = yy;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          listZeleno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }else
          {
            const klasaFigure =  field.children[0].getAttribute("class").split("_");         
            if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
            {
            listCrveno.push({x:newX,y:newY});
            listaDozvoljenihPoteza.push({x:newX,y:newY});
            }
            break;
          }
      }
    }
    for(let i = 1; i < 8; i++){
      //right
      newX = xx + i;
      newY = yy;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          listZeleno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }else
          {
            const klasaFigure =  field.children[0].getAttribute("class").split("_");         
            if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
            {
            listCrveno.push({x:newX,y:newY});
            listaDozvoljenihPoteza.push({x:newX,y:newY});
            }
            break;
          }
      }
    }
    for(let i = 1; i < 8; i++){
      //up
      newX = xx;
      newY = yy - i;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          listZeleno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }else
          {
            const klasaFigure =  field.children[0].getAttribute("class").split("_");         
            if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
            {
            listCrveno.push({x:newX,y:newY});
            listaDozvoljenihPoteza.push({x:newX,y:newY});
            }
            break;
          }
      }
    }
    for(let i = 1; i < 8; i++){
      //down
      newX = xx;
      newY = yy + i;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          listZeleno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }else
          {
            const klasaFigure =  field.children[0].getAttribute("class").split("_");         
            if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
            {
            listCrveno.push({x:newX,y:newY});
            listaDozvoljenihPoteza.push({x:newX,y:newY});      
            }
            break;
          }
      }
    }

    colorInGreen(listZeleno);
    colorInRed(listCrveno);
  }
}
export {RookStrategy};