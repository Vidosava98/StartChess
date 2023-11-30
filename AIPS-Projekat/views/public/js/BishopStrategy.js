import { ChessPieceStrategy } from './ChessPieceStrategy.js';
import { colorInGreen, colorInRed, listaDozvoljenihPoteza } from './socket.js';

class   BishopStrategy extends ChessPieceStrategy {
  dozvoljeniPotezi(xx, yy) {
    let listZeleno = [];  
    let listCrveno = [];
    const mojField = document.querySelector('[data-x="'+ xx +'"][data-y="' + yy + '"]');
    const mojaKlasaFigure = mojField.children[0].getAttribute("class").split("_");
    let newX = null;
    let newY = null;
    const num = 8;
    for(let i = 1; i < num; i++){
      //left-up
      newX = xx - i;
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
    for(let i = 1; i < num; i++){
      //left-down
      newX = xx - i;
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
    for(let i = 1; i < num; i++){
      //right-up
      newX = xx + i;
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
    for(let i = 1; i < num; i++){
      //right-down
      newX = xx + i;
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
export {BishopStrategy};