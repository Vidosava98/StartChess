import { ChessPieceStrategy } from './ChessPieceStrategy.js';
import { colorInGreen, colorInRed, listaDozvoljenihPoteza } from './socket.js';

class   KnightStrategy extends ChessPieceStrategy {
  dozvoljeniPotezi(xx, yy) {
    let listZeleno = [];
    let listCrveno = [];
    let newX = null;
    let newY = null;
    const mojField = document.querySelector('[data-x="'+ xx +'"][data-y="' + yy + '"]');
    const mojaKlasaFigure = mojField.children[0].getAttribute("class").split("_");
    let listXY = [];
       newX = xx - 2;
       newY = yy + 1;
       listXY.push({x:newX, y:newY});
       newX = xx - 1;
       newY = yy + 2;
       listXY.push({x:newX, y:newY});
       newX = xx + 2;
       newY = yy + 1;
       listXY.push({x:newX, y:newY});
       newX = xx + 1;
       newY = yy + 2;
       listXY.push({x:newX, y:newY});
       newX = xx - 2;
       newY = yy - 1;
       listXY.push({x:newX, y:newY});
       newX = xx - 1;
       newY = yy - 2;
       listXY.push({x:newX, y:newY});
       newX = xx + 2;
       newY = yy - 1;
       listXY.push({x:newX, y:newY});
       newX = xx + 1;
       newY = yy - 2;
       listXY.push({x:newX, y:newY});
       listXY.forEach((element) => {
        let field = document.querySelector('[data-x="'+ element.x +'"][data-y="' + element.y + '"]');
        if(field){
          if(!field.children[0]){
            listZeleno.push({x:element.x,y:element.y});
            listaDozvoljenihPoteza.push({x:element.x,y:element.y});
            }else{
              const klasaFigure =  field.children[0].getAttribute("class").split("_");         
              if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
              {
              listCrveno.push({x:element.x,y:element.y});
              listaDozvoljenihPoteza.push({x:element.x,y:element.y});
              }
            }
        }
       });
      
    colorInGreen(listZeleno);
    colorInRed(listCrveno);
}
}
export {KnightStrategy};