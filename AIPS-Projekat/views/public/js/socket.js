const socket = io();
let i = 0;
let s, m, h;
s = m = h = 0;
const listaSlova = ['A','B','C','D','E','F','G','H'];
let listaPoteza = [];
listaPotezaPopuni();
export let listaDozvoljenihPoteza = [];
let listaPojedenihFigura = [];
let listaMojihPojedenihFigura = [];
let intervalID = null;
let intervalID2 =null
const room = document.querySelector("#room").innerHTML;
const email = document.querySelector("#email").innerHTML;
const $obaIgraca = document.querySelector("#obaIgraca");
const $messageForm = document.querySelector("#poruke-forma");
const $messageFormButton = document.querySelector("#messageFormButton");
const $messages = document.querySelector("#messages");
const $messageFormInput = document.querySelector("#inputMessage");
let result = document.querySelector("#result").innerHTML;
let vreme = document.querySelector('#vreme').innerHTML;

import { PawnStrategy } from './PawnStrategy.js';
import { RookStrategy } from './RookStrategy.js';
import { BishopStrategy } from './BishopStrategy.js';
import { KingStrategy } from './KingStrategy.js';
import { KnightStrategy } from './KnightStrategy.js';
import { ChessPieceContext } from './ChessPieceContext.js';
// Usage example:
const pawnStrategy = new PawnStrategy();
const rookStrategy = new RookStrategy();
const bishopStrategy = new BishopStrategy();
const kingStrategy = new KingStrategy();
const knightStrategy = new KnightStrategy();

let chessPieceContext = new ChessPieceContext(pawnStrategy);
chessPieceContext = new ChessPieceContext(rookStrategy);
chessPieceContext = new ChessPieceContext(bishopStrategy);
chessPieceContext = new ChessPieceContext(kingStrategy);
chessPieceContext = new ChessPieceContext(knightStrategy);
// Now, you can change the strategy dynamically:



socket.on('ack', (message) => {
    console.log(message);
});
socket.on('info', (email2) => {
    document.querySelector("#myTurn").innerHTML = true;
    document.querySelector("#myColor").innerHTML = 'W';
    socket.emit('doslaoba',{room:room, email1 : email, email2 : email2}); 
});
socket.on('message', (options) => {
  let vreme = moment(options.datumSlanjaPoruke).format('HH:mm:ss');
  $messages.insertAdjacentHTML('beforeend',`<div class="message" style="margin-left:2%;">
  <span>${options.username}</span> <span>${vreme} </span> 
  <p style="font-size:20px"> ${options.message}</p></div>`)
  document.getElementById('messages').scrollTop = 9999999; 
});
socket.emit('join', { email: email, room : room.toString()}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
});
socket.on('proslediPojedenuFiguru', (options) => {
listaMojihPojedenihFigura.push({html:options.pojedenaFigura.html, class: options.pojedenaFigura.class});
});
socket.on('updateNumbersOfFigure',(options) => {
  document.querySelector("#numbersOffigure").innerHTML = options.numbersOfFigure;
})
socket.on('proslediPotez', (options) => {
  document.querySelector("#odigraniPotezi").insertAdjacentHTML('beforeend',`<div class="potez" style="margin-left:2%;"> <span>${options.username}</span><div style="font-size:20px"> ${options.figuraKojaSeKrece}${options.potez}</div>`);
  document.getElementById('odigraniPotezi').scrollTop = 9999999;
});
socket.on('primiRokaduZaPrikazUIstorijiPoteza', (options) =>{
  const potez1 = listaPoteza[parseInt(options.x1) + parseInt(options.y1) * 8];
  const potez2 = listaPoteza[parseInt(options.x2) + parseInt(options.y2) * 8];
  const img1 = document.querySelector('[data-x="'+ options.x1 +'"][data-y="' + options.y1 + '"]').innerHTML
  const img2 = document.querySelector('[data-x="'+ options.x2 +'"][data-y="' + options.y2 + '"]').innerHTML
  document.querySelector("#odigraniPotezi").insertAdjacentHTML('beforeend',`<div class="potez" style="margin-left:2%;"><span> Rokada </span> <div style="font-size:20px"> ${img1}${potez1}</div> <div style="font-size:20px"> ${img2}${potez2}</div>`);
  document.getElementById('odigraniPotezi').scrollTop = 9999999;
});
socket.on('primiSahMat', (sahMat) => {
  document.getElementById("idSah").hidden = false;
  document.getElementById("idSah").innerHTML = sahMat;
  console.log("primiSahMat");
  document.querySelector("#idOdustani").setAttribute('disabled', 'disabled');
  document.querySelector("#result").innerHTML = "Pobeda je tvoja, čestitam!"
  const krajJe = true;
  socket.emit('pomeriFiguru',{x1:0, y1:0, x2:0, y2:0, img:null, krajJe, rokada:null});
  document.querySelector('#myTurn').innerHTML = false;
})   
socket.on('primiVracenuFiguru', (options) => {
  console.log(options.x2, options.y2, options.html);
  document.querySelector('[data-x="'+ options.x2 +'"][data-y="' + options.y2 + '"]').innerHTML = options.html;
});
socket.on('prikaziPartiju',(options) => {

    document.querySelector("#result").innerHTML = options.r;
    document.querySelector("#numbersOffigure").innerHTML = options.n;
    document.querySelector('#vreme').innerHTML = moment(options.d).format('D.M.YYYY HH:mm');
    document.querySelector('#idGame').innerHTML = options.id;
    let bojaIgraca1 = null;
    let bojaIgraca2 = null;
    if(options.user1.color === "W"){
      bojaIgraca1 = "Beli";
    }else{
      bojaIgraca1 = "Crni";
    }
    if(options.user2.color === "W"){
      bojaIgraca2 = "Beli";
    }else{
      bojaIgraca2 = "Crni";
    }
    $obaIgraca.insertAdjacentHTML('beforeend', `<div class="card" style="width:80%; background-color: #bbc8f0; margin:5%">
    <div class="card-body">
      <h5>Opis igrača</h5>
      <h5 class="card-title">${options.user1.name}</h5>
      <p class="card-text">${options.user1.email}</p>
      <div style="display: flex; padding-left: 20px; padding-right: 20px;">
      <div class="card-text" style="width: 80px;height: 30px;">${bojaIgraca1}</div>
      <div id="bojaIgraca1" style="width: 30px;height: 30px;"></div>
      </div>
       <div class="card-text">
         Datum prijave:  ${moment(options.user1.date).format('D.M.YYYY HH:mm')}
       </div> 
       <div class="card-text">
       Poslednja partija: ${moment(options.user1.lastConnection).format('D.M.YYYY HH:mm')}
       </div> 
    </div>
    </div>`);
    $obaIgraca.insertAdjacentHTML('beforeend', `<div class="card" style="width:80%; background-color: #c94646; margin:5%">
    <div class="card-body">
        <h5>Opis igrača</h5>
        <h5 class="card-title">${options.user2.name}</h5>
        <p class="card-text">${options.user2.email}</p>
        <div style="display: flex; padding-left: 20px; padding-right: 20px;"> 
        <div class="card-text" style="width: 80px;height: 30px;">${bojaIgraca2}</div>
        <div id="bojaIgraca2" style="width: 30px;height: 30px;"></div>
        </div>
        <div class="card-text">
        Datum prijave: ${moment(options.user2.date).format('D.M.YYYY HH:mm')}
        </div> 
        <div class="card-text">
        Poslednja partija: ${moment(options.user2.lastConnection).format('D.M.YYYY HH:mm')}
        </div> 
    </div>
    </div>`);
    if(options.user1.color === "W"){
      document.querySelector('#bojaIgraca1').style.backgroundColor = "#ffffff";
    }else{
      document.querySelector('#bojaIgraca1').style.backgroundColor = "#000000";
    }
    if(options.user2.color === "W"){
      document.querySelector('#bojaIgraca2').style.backgroundColor = "#ffffff";
    }else{
     document.querySelector('#bojaIgraca2').style.backgroundColor = "#000000";
    }
    if(document.querySelector('#myTurn').innerHTML === 'true'){
    // if(!intervalID)
    // intervalID = setInterval(timerCounter, 1000);
    }else{
      console.log('Nije moj red');
    }
});
socket.on('updateTimer', (options) => {
  document.getElementById("idCountDown").innerHTML = options.timeRemaining;
})
$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  $messageFormButton.setAttribute('disabled', 'disabled');
  const message = e.target.elements.message.value;
  socket.emit('sendMessage', message, (error) => {
      $messageFormButton.removeAttribute('disabled');
      $messageFormInput.value = '';
      $messageFormInput.focus();

      if (error) {
          return console.log(error);
      }

      console.log('Message delivered!');
  });
});
document.querySelector("#idOdustani").addEventListener("click", function (e) {
  console.log("Odustao si");
  document.querySelector("#idOdustani").setAttribute('disabled', 'disabled');
  socket.emit('proslediSahMat',"Protivnik je predao meč!");
  document.getElementById("idSah").hidden = false;
  document.getElementById("idSah").innerHTML = "Odustao si!";
  document.querySelector('#myTurn').innerHTML = false;
});
document.querySelector("#chessboard").addEventListener("click", function (e) {
  var tile = e.target;
  if(document.querySelector('#myTurn').innerHTML === 'true'){
 
   if(document.querySelector("#firstClick") === null){
   firstClick(tile);
   }
   else{
   secondClick(tile);
   if(document.querySelector('#firstMove').innerHTML === 'true' 
    && document.querySelector('#myColor').innerHTML === 'W'
    && document.querySelector('#myTurn').innerHTML === 'true' ){
    document.querySelector('#firstMove').innerHTML = 'false';
    clearInterval(intervalID2);
    clearInterval(intervalID);
   }
  }
}});
socket.on('proslediPomeriFiguru',(options) =>{
  if(!options.krajJe){
    if(options.rokada){
      rokadaMove(options.x1 , options.y1, options.x2, options.y2);
     } else{
      document.querySelector('[data-x="'+ options.x1 +'"][data-y="' + options.y1 + '"]').innerHTML = '';
      document.querySelector('[data-x="'+ options.x2 +'"][data-y="' + options.y2 + '"]').innerHTML = options.img;
     }  
     proveraSah();
     proveraSeh();
     proveraSuh();
}
  
  if(options.krajJe){
    document.querySelector("#result").innerHTML = "Protivnik je pobedio!";
    document.querySelector('#myTurn').innerHTML = false;
    document.querySelector("#idOdustani").setAttribute('disabled', 'disabled');
  }else{
    document.querySelector('#myTurn').innerHTML = true;
    // if(!intervalID)
    // intervalID = setInterval(timerCounter, 1000);
  }
});
  function dozvoljeniPotezi(x, y){
    const klasaSlike = document.querySelector('[data-x="'+ x +'"][data-y="' + y + '"]').children[0].getAttribute("class"); 
    let elementiSlikeFigure = klasaSlike.split("_");
    let listaZaVratiti = [];
    switch(elementiSlikeFigure[1].toString()) {
      case "pawn":
        chessPieceContext.setStrategy(pawnStrategy);
        chessPieceContext.dozvoljeniPotezi(x, y);
        break;
      case "rook":
        chessPieceContext.setStrategy(rookStrategy);
        chessPieceContext.dozvoljeniPotezi(x,y);
        break;
      case "queen":
        chessPieceContext.setStrategy(rookStrategy);
        chessPieceContext.dozvoljeniPotezi(x,y);
        chessPieceContext.setStrategy(bishopStrategy);
        chessPieceContext.dozvoljeniPotezi(x,y);
        break;
      case "bishop":
        chessPieceContext.setStrategy(bishopStrategy);
        chessPieceContext.dozvoljeniPotezi(x,y);
        break;
      case "king":
        chessPieceContext.setStrategy(kingStrategy);
        chessPieceContext.dozvoljeniPotezi(x,y);
        break;
      case "knight":
        chessPieceContext.setStrategy(knightStrategy);
        chessPieceContext.dozvoljeniPotezi(x,y);
        break;
      default:
        listaDozvoljenihPoteza = [];
    }
  }
  function firstClick(tile){
    let x = 0;
    let y = 0;
    if(tile.nodeName  !== "DIV")
    {
      if(tile.getAttribute("id").trim().toLowerCase() === document.querySelector("#myColor").innerHTML.trim().toLocaleLowerCase())
      {
        x = tile.parentNode.getAttribute("data-x");
        y = tile.parentNode.getAttribute("data-y");
        tile.parentNode.style.backgroundColor = "#f5f3dade";
        tile.parentNode.setAttribute("id", "firstClick");
        listaDozvoljenihPoteza = [];
        dozvoljeniPotezi(x, y);
      }
    }
  }
  function secondClick(tile){
  let x1 = null, x2 = null, y1 = null, y2 = null;
  const img = document.querySelector("#firstClick").innerHTML;
  //uzmamo x i y za polje sa kog se pomeramo, treba nam da bi poslali drugom useru
    x1 = document.querySelector("#firstClick").getAttribute("data-x");
    y1 = document.querySelector("#firstClick").getAttribute("data-y");
  
  //uzimamo x i y za polje na koje se pomeramo
  if(tile.nodeName  === "DIV"){
     x2 = tile.getAttribute("data-x");
     y2 = tile.getAttribute("data-y");
  }else{
    x2 = tile.parentNode.getAttribute("data-x");
    y2 = tile.parentNode.getAttribute("data-y");
  }
 if(!ifRokada(x1, y1, x2, y2)){
  let listaFilter = [];
  listaFilter = listaDozvoljenihPoteza.filter((element) => element.x.toString() === x2.toString() && element.y.toString() === y2.toString());
  
  if(listaFilter.length > 0){
    const Field = document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]');
    if(Field)
    if(Field.children[0]){
    const pojedenaFigura = { html:Field.innerHTML, class:Field.children[0].getAttribute("class")};
    const klasaDelovi = Field.children[0].getAttribute("class").split("_");
    if(klasaDelovi[1].toString() !== "king"){
    listaPojedenihFigura.push(pojedenaFigura);
    const id = document.querySelector("#idGame").innerHTML;
    socket.emit('posaljiPojedenuFiguru', {pojedenaFigura, id});
    }
    }
    //figura koja se krece sigurno postoji
    const fieldPrvi = document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]');
    const figuraKojaSeKrece = fieldPrvi.innerHTML;
    const potez = listaPoteza[parseInt(x2) + parseInt(y2) * 8];
    socket.emit('posaljiPotez',{potez, figuraKojaSeKrece});
    pomeriFiguru(x1,y1,x2,y2,img,tile,false);
    removeGreenField();
    removeRedField();
    pawnOnTheEnd(x2, y2);
  }
  else{
    returnFirstClickColor();
    document.querySelector("#firstClick").setAttribute("id","");
    removeGreenField();
    removeRedField();
  }
 }else{
  pomeriFiguru(x1,y1,x2,y2,img,tile,true);
  returnFirstClickColor();
  document.querySelector("#firstClick").setAttribute("id","");
  removeGreenField();
  removeRedField();
 }
}
  function returnFirstClickColor(){
    if( document.querySelector("#firstClick").getAttribute("class").trim().toLowerCase() === "b")
    { document.querySelector("#firstClick").style.backgroundColor = "#bbc8f0"; }
    else
    { document.querySelector("#firstClick").style.backgroundColor = "#FFF"; }
  }
  function pomeriFiguru(x1, y1, x2, y2, img, tile, rokada){

    const secondClickField = document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]');
    let krajJe = false; 
   if(!rokada){
    if(secondClickField){
      if(secondClickField.children[0]){
        const secondClickKlasaFigure = secondClickField.children[0].getAttribute("class").split("_"); 
        if(secondClickKlasaFigure[1].toString() === "king")
        {   
            document.querySelector("#result").innerHTML = "Pobeda je tvoja, čestitam!"
            krajJe = true;
            const bojaIgraca = document.querySelector('#myColor').innerHTML;
            const idGame = document.querySelector('#idGame').innerHTML;
            socket.emit('krajJeUpdateGame',{idGame, bojaIgraca});
            document.querySelector("#idOdustani").setAttribute('disabled', 'disabled');
        }
      }
      } 
      socket.emit('pomeriFiguru',{x1, y1, x2, y2, img, krajJe, rokada});
      returnFirstClickColor();
      if(!krajJe){
        document.querySelector("#firstClick").innerHTML = "";
        document.querySelector("#firstClick").setAttribute("id","");
        if(tile.nodeName  === "DIV"){
        tile.innerHTML = img;}
        else{
        tile.parentNode.innerHTML = img;}
      }
      document.querySelector('#myTurn').innerHTML = false;
      document.getElementById("idSeh").hidden = true;
      document.getElementById("idSuh").hidden = true;
      document.getElementById("idSah").hidden = true;
      proveraSahMat();  
   } else{
    socket.emit('pomeriFiguru',{x1, y1, x2, y2, img, krajJe, rokada});
    rokadaMove(x1, y1, x2, y2);
    document.querySelector('#myTurn').innerHTML = false;
   }   
  
  }
  export function colorInRed(list){
    list.forEach(function(currentElement, index) 
    { 
      const element = document.querySelector('[data-x="'+ currentElement.x +'"][data-y="' + currentElement.y + '"]');
      element.style.backgroundColor = '';
      element.setAttribute("id","colorRed");

    });
  }
  export function colorInGreen(list){
    list.forEach(function(currentElement, index) 
    { 
      const element = document.querySelector('[data-x="'+ currentElement.x +'"][data-y="' + currentElement.y + '"]');
      element.setAttribute("id","colorGreen");
      element.style.backgroundColor = '';
    });
  }
  function removeGreenField(){
    const listElementsInGreen = document.querySelectorAll('#colorGreen');
    listElementsInGreen.forEach((el) => {
    el.setAttribute("id",'');
    if( el.getAttribute("class").trim().toLowerCase() === "b")
    { el.style.backgroundColor = "#bbc8f0"; }
    else
    { el.style.backgroundColor = "#FFF"; }
    });
  }
  function removeRedField(){
    const listElementsInRed = document.querySelectorAll('#colorRed');
    listElementsInRed.forEach((el) => {
    el.setAttribute("id",'');
    if( el.getAttribute("class").trim().toLowerCase() === "b")
    { el.style.backgroundColor = "#bbc8f0"; }
    else
    { el.style.backgroundColor = "#FFF"; }
    });
  }
  function timerCounter() {
    const timer = document.getElementById("idTimerCounter").innerHTML;
    const hhMMss = timer.split(":"); 
    let sec, min, hour;
    if(document.querySelector('#myTurn').innerHTML === 'true'){
      hour = parseInt(hhMMss[0]);
      min = parseInt(hhMMss[1]);
      sec = parseInt(hhMMss[2]);
      sec = sec + 1;
      if(sec > 60){
        sec = 0;
        min = min + 1;
        if(min > 60)
        {
        min = 0;
        hour = hour + 1
        }
      }
      const hh = (sec<10) ? "0" + hour : hour; 
      const mm = (min<10) ? "0" + min : min; 
      const ss = (sec<10) ? "0" + sec : sec; 
      document.getElementById("idTimerCounter").innerHTML =  hh + ":" + mm + ":" + ss;
    }else{
      document.getElementById("idTimerCounter").innerHTML =  "00:00:00"
    }
   
  }
  function ifRokada(x1, y1, x2, y2){
    let klasaFigure = null; 
    let mojaKlasaFigure = null;

    const Field = document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]');
    if(Field)
    if(Field.children[0])
    klasaFigure = Field.children[0].getAttribute("class").split("_");

    const mojField = document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]');
    if(mojField)
    if(mojField.children[0])
    mojaKlasaFigure = mojField.children[0].getAttribute("class").split("_");

    if(mojaKlasaFigure && klasaFigure){

         if((klasaFigure[1] === "king" && mojaKlasaFigure[1] === "rook" && x2 === '7' && y2 === '7') || (klasaFigure[1] === "rook" && mojaKlasaFigure[1] === "king" && x1 === '7' && y1 === '7') )
         {
          //minor castling for W
          const isEmpyFildForBishop = document.querySelector('[data-x="'+ 5 +'"][data-y="' + 7 + '"]').innerHTML; 
          const isEmpyFildForKnight = document.querySelector('[data-x="'+ 6 +'"][data-y="' + 7 + '"]').innerHTML; 
          if(!isEmpyFildForBishop && !isEmpyFildForKnight){return true;}
          else{ return false;}       
        
         }else if((klasaFigure[1] === "king" && mojaKlasaFigure[1] === "rook" && x2 === '0' && y2 === '7') || (klasaFigure[1] === "rook" && mojaKlasaFigure[1] === "king" && x1 === '0' && y1 === '7'))
         {
          //major casling for W
            const isEmpyFildForBishop = document.querySelector('[data-x="'+ 1 +'"][data-y="' + 7 + '"]').innerHTML; 
            const isEmpyFildForKnight = document.querySelector('[data-x="'+ 2 +'"][data-y="' + 7 + '"]').innerHTML;
            const isEmpyFildForQueen = document.querySelector('[data-x="'+ 3 +'"][data-y="' + 7 + '"]').innerHTML; 
            if(!isEmpyFildForBishop && !isEmpyFildForKnight && !isEmpyFildForQueen){return true;}
            else{ return false;}
         }else if((klasaFigure[1] === "king" && mojaKlasaFigure[1] === "rook" && x2 === '7' && y2 === '0') || (klasaFigure[1] === "rook" && mojaKlasaFigure[1] === "king" && x1 === '7' && y1 === '0'))
         {
           //minor castling for B
           const isEmpyFildForBishop = document.querySelector('[data-x="'+ 5 +'"][data-y="' + 0 + '"]').innerHTML; 
           const isEmpyFildForKnight = document.querySelector('[data-x="'+ 6 +'"][data-y="' + 0 + '"]').innerHTML; 
           if(!isEmpyFildForBishop && !isEmpyFildForKnight)
           {return true;}
           else{return false;}
         }
         else if((klasaFigure[1] === "king" && mojaKlasaFigure[1] === "rook" && x2 === '0' && y2 === '0') || (klasaFigure[1] === "rook" && mojaKlasaFigure[1] === "king" && x1 === '0' && y1 === '0'))
         {
           //major castling for B
           const isEmpyFildForBishop = document.querySelector('[data-x="'+ 1 +'"][data-y="' + 0 + '"]').innerHTML; 
           const isEmpyFildForKnight = document.querySelector('[data-x="'+ 2 +'"][data-y="' + 0 + '"]').innerHTML; 
           const isEmpyFildForQueen = document.querySelector('[data-x="'+ 3 +'"][data-y="' + 0 + '"]').innerHTML;
           if(!isEmpyFildForBishop && !isEmpyFildForKnight && !isEmpyFildForQueen)
           {return true;}
           else{return false;}
         }
         else
         {
           return false;
         }
     }
  }
  function rokadaMove(x1, y1, x2, y2){
  const pomFirstImg = document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]');
  const pomSecondImg = document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]');
  const klasa = pomFirstImg.children[0].getAttribute("class").split("_");
  if(x1 === '7' || x2 === '7')
  {
    //right side
    if(klasa[1] === "king"){
    document.querySelector('[data-x="'+ 5 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML; 
    document.querySelector('[data-x="'+ 6 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML; 
    document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
    document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
    socket.emit('posaljiRokaduZaPrikazUIstorijiPoteza',{x1:6, y1:y1, x2:5, y2:y2});
    }else{
      document.querySelector('[data-x="'+ 6 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML;
      document.querySelector('[data-x="'+ 5 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML;
      document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
      document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
      socket.emit('posaljiRokaduZaPrikazUIstorijiPoteza',{x1:5, y1:y1, x2:6, y2:y2});
    }
  }else
  {
    //left side
    if(klasa[1] === "king"){
      document.querySelector('[data-x="'+ 3 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML; 
      document.querySelector('[data-x="'+ 2 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML; 
      document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
      document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
      socket.emit('posaljiRokaduZaPrikazUIstorijiPoteza',{x1:2, y1:y1, x2:3, y2:y2});
      }else{
        document.querySelector('[data-x="'+ 2 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML;
        document.querySelector('[data-x="'+ 3 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML;
        document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
        document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
        socket.emit('posaljiRokaduZaPrikazUIstorijiPoteza',{x1:3, y1:y1, x2:2, y2:y2});
      }
  }
  }
  function pawnOnTheEnd(x2, y2){
    let listEnd = [];
    const Field = document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]');
    if(Field)
    if(Field.children[0]){
    const klasaFigure = Field.children[0].getAttribute("class").split("_");
    if(klasaFigure[1].toString() === "pawn"){
      console.log(klasaFigure);
      if(klasaFigure[0].toString()  === 'W'){
        listEnd = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0},{x:7,y:0}];
        }else{
        listEnd = [{x:0,y:7},{x:1,y:7},{x:2,y:7},{x:3,y:7},{x:4,y:7},{x:5,y:7},{x:6,y:7},{x:7,y:7}];
        }
      listEnd.forEach((element) => {
        if(element.x === parseInt(x2) && element.y === parseInt(y2))
        {
          console.log(listaMojihPojedenihFigura);
          if(listaMojihPojedenihFigura){
            listaMojihPojedenihFigura.forEach((el, index) => {
              console.log(el);
            let elementKlasa = el.class.split("_");
            let html = el.html;
            if(elementKlasa[1] === 'queen')
            {
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = html;
              listaMojihPojedenihFigura.splice(index,1);
              socket.emit('posaljiVracenuFiguru',{x2, y2, html});
              return;
            }else if(elementKlasa[1] === 'rook'){
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = html;
              listaMojihPojedenihFigura.splice(index,1);
              socket.emit('posaljiVracenuFiguru',{x2, y2, html});
              return;
            }else if(elementKlasa[1] === 'knight'){
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = html;
              listaMojihPojedenihFigura.splice(index,1);
              socket.emit('posaljiVracenuFiguru',{x2, y2, html});
              return;
            }else if(elementKlasa[1] === 'bishop'){
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = html;
              listaMojihPojedenihFigura.splice(index,1);
              socket.emit('posaljiVracenuFiguru',{x2, y2, html});
              return;
            }
          })
          }
        }
      });
    } 
   }
  }
  function listaPotezaPopuni(){
    for(let i = 8; i >= 1; i-- )
      for(let j = 1; j <= 8; j++ )
      { listaPoteza.push(i + listaSlova[j-1]); }
  }
  function proveraSah(){
    const koord = nadjiKralja();
    if(koord){
    const xKralj = koord['x'];
    const yKralj = koord['y'];
    listaDozvoljenihPoteza = [];
    let listKordProtivnikovihFigura = [];
    listKordProtivnikovihFigura = kordProtivnikovihFigura();
    listKordProtivnikovihFigura.forEach(element => {
      dozvoljeniPotezi(element.x, element.y);
     });
     removeGreenField();
     removeRedField();
    listaDozvoljenihPoteza.forEach(element => {
      if(element.x.toString() === xKralj.toString() && element.y.toString() === yKralj.toString()){
      document.getElementById("idSah").hidden = false;
      }
    });
    }
  }
  function proveraSahMat(){
    const koord = nadjiKralja();
    if(koord){
    const xKralj = koord['x'];
    const yKralj = koord['y'];
    listaDozvoljenihPoteza = [];
    let listKordProtivnikovihFigura = [];
    listKordProtivnikovihFigura = kordProtivnikovihFigura();
    listKordProtivnikovihFigura.forEach(element => {
      dozvoljeniPotezi(element.x, element.y);
     });
     removeGreenField();
     removeRedField();
    listaDozvoljenihPoteza.forEach(element => {
      if(element.x.toString() === xKralj.toString() && element.y.toString() === yKralj.toString()){
        console.log("Matiran si");
        socket.emit('proslediSahMat',"Matirao si protivnika");
        document.getElementById("idSah").hidden = false;
        document.getElementById("idSah").innerHTML = "Matiran si!";
        document.querySelector('#myTurn').innerHTML = false;
      }
    });
    }
  }
  function proveraSeh(){
    const koord = nadjiKraljicu();
    if(koord){
      const xKraljica = koord['x'];
      const yKraljica = koord['y'];
      listaDozvoljenihPoteza = [];
      let listKordProtivnikovihFigura = [];
      listKordProtivnikovihFigura = kordProtivnikovihFigura();
      listKordProtivnikovihFigura.forEach(element => {
        dozvoljeniPotezi(element.x, element.y);
       });
       removeGreenField();
       removeRedField();
      listaDozvoljenihPoteza.forEach(element => {
        if(element.x.toString() === xKraljica.toString() && element.y.toString() === yKraljica.toString()){
          document.getElementById("idSeh").hidden = false;
        }
      });
    }
  }
  function proveraSuh(){
    const koord = nadjiTopove();
    if(koord){
      koord.forEach(element => {
        const xTop = element['x'];
        const yTop = element['y']; 
        listaDozvoljenihPoteza = [];
        let listKordProtivnikovihFigura = [];
        listKordProtivnikovihFigura = kordProtivnikovihFigura();
        listKordProtivnikovihFigura.forEach(element => {
          dozvoljeniPotezi(element.x, element.y);
         });
         removeGreenField();
         removeRedField();
        listaDozvoljenihPoteza.forEach(element => {
          if(element.x.toString() === xTop.toString() && element.y.toString() === yTop.toString()){
            document.getElementById("idSuh").hidden = false;
          }
        });
      });
    }
  }
  function nadjiKralja(){
    for(let i=0; i < 8; i++)
    for(let j=0; j < 8; j++)
     {
       const field = document.querySelector('[data-x="'+ i +'"][data-y="' + j + '"]');
       if(field)
         if(field.children[0]){
        const klasaFigure = field.children[0].getAttribute("class").split("_");
        const boja = document.querySelector("#myColor").innerHTML;
        if(klasaFigure[1] === "king" && klasaFigure[0].toLowerCase() === boja.toLowerCase())
        {
          const x = i;
          const y = j;
          return {x:x, y:y};
        }
       }
     }
  }
  function nadjiKraljicu(){
    for(let i=0; i < 8; i++)
    for(let j=0; j < 8; j++)
     {
       const field = document.querySelector('[data-x="'+ i +'"][data-y="' + j + '"]');
       if(field)
         if(field.children[0]){
        const klasaFigure = field.children[0].getAttribute("class").split("_");
        const boja = document.querySelector("#myColor").innerHTML;
        if(klasaFigure[1] === "queen" && klasaFigure[0].toLowerCase() === boja.toLowerCase())
        {
          const x = i;
          const y = j;
          return {x:x, y:y};
        }
       }
     }
  }
  function nadjiTopove(){
    let listaTopova = [];
    for(let i=0; i < 8; i++)
    for(let j=0; j < 8; j++)
     {
       const field = document.querySelector('[data-x="'+ i +'"][data-y="' + j + '"]');
       if(field)
         if(field.children[0]){
        const klasaFigure = field.children[0].getAttribute("class").split("_");
        const boja = document.querySelector("#myColor").innerHTML;
        if(klasaFigure[1] === "rook" && klasaFigure[0].toLowerCase() === boja.toLowerCase())
        {
          const x = i;
          const y = j;
          listaTopova.push({x, y});
        }
       }
     }
     return listaTopova;
  }
  function kordProtivnikovihFigura(){
    let lista = [];
    for(let i=0; i < 8; i++)
    for(let j=0; j < 8; j++)
     {
       const field = document.querySelector('[data-x="'+ i +'"][data-y="' + j + '"]');
       if(field)
         if(field.children[0]){
        const klasaFigure = field.children[0].getAttribute("class").split("_");
        const boja = document.querySelector("#myColor").innerHTML;
        if(klasaFigure[0].toLowerCase() !== boja.toLowerCase())
        {
          const x = i;
          const y = j;
          lista.push({x:x, y:y});
        }
       }
     }
     return lista;
  }