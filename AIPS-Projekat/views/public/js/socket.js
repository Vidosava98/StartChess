const socket = io();
let i = 0;
let s, m, h;
s = m = h = 0;
let listaDozvoljenihPoteza = [];
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
const $messageFormInput = document.querySelector("#inputMessage")
let result = document.querySelector("#result").innerHTML;
let vreme = document.querySelector('#vreme').innerHTML;

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
  $messages.insertAdjacentHTML('beforeend',`<div class="message" style="margin-left:2%;"><span>${options.username}</span> <span>${vreme} </span> <p style="font-size:20px"> ${options.message}</p></div>`)
});
socket.emit('join', { email: email, room : room.toString()}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
});
socket.on('proslediPojedenuFiguru', (pojedenaFigura) => {
console.log(pojedenaFigura);
listaMojihPojedenihFigura.push(pojedenaFigura);
})
socket.on('prikaziPartiju',(options) => {

    document.querySelector("#result").innerHTML = options.r;
    document.querySelector('#vreme').innerHTML = moment(options.d).format('D.M.YYYY HH:mm');
    $obaIgraca.insertAdjacentHTML('beforeend', `<div class="card" style="width:80%; background-color: #bbc8f0; margin:5%">
    <div class="card-body">
      <h5>Opis igrača</h5>
      <h5 class="card-title">${options.user1.name}</h5>
      <p class="card-text">${options.user1.email}</p>
      <p class="card-text">${options.user1.color}</p>
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
        <p class="card-text">${options.user2.color}</p>
        <div class="card-text">
        Datum prijave: ${moment(options.user2.date).format('D.M.YYYY HH:mm')}
        </div> 
        <div class="card-text">
        Poslednja partija: ${moment(options.user2.lastConnection).format('D.M.YYYY HH:mm')}
        </div> 
    </div>
    </div>`);
    if(document.querySelector('#myTurn').innerHTML === 'true'){
    if(!intervalID)
    intervalID = setInterval(timerCounter, 1000);
    }else{
      console.log('Nije moj red');
    }
  setInterval(myGreeting, 1000);

});
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
  if(!options.rokada){
  document.querySelector('[data-x="'+ options.x1 +'"][data-y="' + options.y1 + '"]').innerHTML = '';
  document.querySelector('[data-x="'+ options.x2 +'"][data-y="' + options.y2 + '"]').innerHTML = options.img;
  }else{
    rokadaMove(options.x1 , options.y1, options.x2, options.y2);
  }
  if(options.krajJe){
    document.querySelector("#result").innerHTML = "Protivnik je pobedio!";
    document.querySelector('#myTurn').innerHTML = false;
  }else{
    document.querySelector('#myTurn').innerHTML = true;
    if(!intervalID)
    intervalID = setInterval(timerCounter, 1000);
  }
});
  function myGreeting() {
    s = s + 1;
    if(s > 60){
      s = 0;
      m = m + 1;
      if(m > 60)
      {
      m = 0;
      h = h + 1
      }
    }
    hh = (h<10) ? "0" + h : h; 
    mm = (m<10) ? "0" + m : m; 
    ss = (s<10) ? "0" + s : s; 
    document.getElementById("idCountDown").innerHTML =  hh + ":" + mm + ":" + ss;
  }
  function dozvoljeniPotezi(x, y){
  const xx = parseInt(x);
  const yy = parseInt(y);
    const klasaSlike = document.querySelector('[data-x="'+ x +'"][data-y="' + y + '"]').children[0].getAttribute("class"); 
    let elementiSlikeFigure = klasaSlike.split("_");
    switch(elementiSlikeFigure[1].toString()) {
      case "pawn":
        dozvoljeniPoteziPawn(xx, yy, elementiSlikeFigure);
        break;
      case "rook":
        dozvoljeniPoteziRook(xx, yy);
        break;
      case "queen":
        dozvoljeniPoteziQueen(xx, yy);
        break;
      case "bishop":
        dozvoljeniPoteziBishop(xx, yy, 8);
        break;
      case "king":
        dozvoljeniPoteziKing(xx, yy);
        break;
      case "knight":
        dozvoljeniPoteziKnight(xx, yy);
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
    klasaFigure = Field.children[0].getAttribute("class").split("_");
    //console.log(Field.innerHTML);
     const pojedenaFigura = { html:Field.innerHTML, class:Field.children[0].getAttribute("class")};
    listaPojedenihFigura.push(pojedenaFigura);
    socket.emit('posaljiPojedenuFiguru', pojedenaFigura);
    }
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
        }
      }
      } 
      socket.emit('pomeriFiguru',{x1, y1, x2, y2, img, krajJe, rokada});
      returnFirstClickColor();
      document.querySelector("#firstClick").innerHTML = "";
      document.querySelector("#firstClick").setAttribute("id","");
      if(tile.nodeName  === "DIV"){
      tile.innerHTML = img;}
      else{
      tile.parentNode.innerHTML = img;}
      document.querySelector('#myTurn').innerHTML = false;
   } else{
    socket.emit('pomeriFiguru',{x1, y1, x2, y2, img, krajJe, rokada});
    rokadaMove(x1, y1, x2, y2);
    document.querySelector('#myTurn').innerHTML = false;
   }   
  
  }
  function dozvoljeniPoteziPawn(xx, yy, elementiSlikeFigure){
    let list = [];
    let newX = null;
    let newY = null;
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
          if(newX > -1 && newY > 0 && klasaFigure[0].toString() === "B" ){
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
  function dozvoljeniPoteziRook(xx, yy){
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
  function dozvoljeniPoteziQueen(xx, yy){
    dozvoljeniPoteziRook(xx, yy);
    dozvoljeniPoteziBishop(xx, yy, 8);
  }
  function dozvoljeniPoteziBishop(xx, yy, num){
    let listZeleno = [];  
    let listCrveno = [];
    const mojField = document.querySelector('[data-x="'+ xx +'"][data-y="' + yy + '"]');
    const mojaKlasaFigure = mojField.children[0].getAttribute("class").split("_");
    let newX = null;
    let newY = null;

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
  function dozvoljeniPoteziKing(xx, yy){

    let listZeleno = [];
    let listCrveno = [];
    let newX = null;
    let newY = null;
    const mojField = document.querySelector('[data-x="'+ xx +'"][data-y="' + yy + '"]');
    const mojaKlasaFigure = mojField.children[0].getAttribute("class").split("_");
    //down
       newX = xx;
       newY = yy + 1;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          listZeleno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }else{
            const klasaFigure =  field.children[0].getAttribute("class").split("_");         
            if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
            {
            listCrveno.push({x:newX,y:newY});
            listaDozvoljenihPoteza.push({x:newX,y:newY});
            }
          }
      }
    //up
       newX = xx;
       newY = yy - 1;
      field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
            listZeleno.push({x:newX,y:newY});
            listaDozvoljenihPoteza.push({x:newX,y:newY});
          }else{
            const klasaFigure =  field.children[0].getAttribute("class").split("_");         
            if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
            {
            listCrveno.push({x:newX,y:newY});
            listaDozvoljenihPoteza.push({x:newX,y:newY});
            }
            }
      }
    //right
      newX = xx + 1;
      newY = yy;
      field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
     if(field){
       if(!field.children[0]){
          listZeleno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
        }else{
          const klasaFigure =  field.children[0].getAttribute("class").split("_");         
          if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
          {
          listCrveno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }
        }
     }
    //left
      newX = xx - 1;
      newY = yy;
     field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
     if(field){
       if(!field.children[0]){
          listZeleno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
        }else{
          const klasaFigure =  field.children[0].getAttribute("class").split("_");         
          if(klasaFigure[0].toString() !== mojaKlasaFigure[0].toString())
          {
          listCrveno.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
          }
        }
     }
    colorInGreen(listZeleno);
    colorInRed(listCrveno);
    dozvoljeniPoteziBishop(xx, yy, 2);
  }
  function dozvoljeniPoteziKnight(xx, yy){
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
  function colorInRed(list){
    list.forEach(function(currentElement, index) 
    { 
      const element = document.querySelector('[data-x="'+ currentElement.x +'"][data-y="' + currentElement.y + '"]');
      element.style.backgroundColor = '';
      element.setAttribute("id","colorRed");

    });
  }
  function colorInGreen(list){
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
    if(klasa[1] === "king"){
    document.querySelector('[data-x="'+ 5 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML; 
    document.querySelector('[data-x="'+ 6 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML; 
    document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
    document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
    }else{
      document.querySelector('[data-x="'+ 6 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML;
      document.querySelector('[data-x="'+ 5 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML;
      document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
      document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
    }
  }else
  {
    if(klasa[1] === "king"){
      document.querySelector('[data-x="'+ 3 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML; 
      document.querySelector('[data-x="'+ 2 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML; 
      document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
      document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
      }else{
        document.querySelector('[data-x="'+ 2 +'"][data-y="' + y1 + '"]').innerHTML = pomSecondImg.innerHTML;
        document.querySelector('[data-x="'+ 3 +'"][data-y="' + y2 + '"]').innerHTML = pomFirstImg.innerHTML;
        document.querySelector('[data-x="'+ x1 +'"][data-y="' + y1 + '"]').innerHTML = '';
        document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = '';
      }
  }
  }
  function pawnOnTheEnd(x2, y2){
    let listEnd = [];
    const Field = document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]');
    if(Field)
    if(Field.children[0]){
    klasaFigure = Field.children[0].getAttribute("class").split("_");
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
            const elementKlasa = el.class.split("_");
            console.log(elementKlasa);
            console.log("U deo sam kad je pawn na kraju table")
            if(elementKlasa[1] === 'queen')
            {
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = el.html;
              console.log("ubacen je" + elementKlasa[1]);
              listaMojihPojedenihFigura.splice(index,1);
              return;
            }else if(elementKlasa[1] === 'rook'){
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = el.html;
              console.log("ubacen je" + elementKlasa[1]);
              listaMojihPojedenihFigura.splice(index,1);
              return;
            }else if(elementKlasa[1] === 'knight'){
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = el.html;
              console.log("ubacen je" + elementKlasa[1]);
              listaMojihPojedenihFigura.splice(index,1);
              return;
            }else if(elementKlasa[1] === 'bishop'){
              document.querySelector('[data-x="'+ x2 +'"][data-y="' + y2 + '"]').innerHTML = el.html;
              console.log("ubacen je" + elementKlasa[1]);
              listaMojihPojedenihFigura.splice(index,1);
              return;
            }
          })
          }
        }
      });
    } 
   }
  }