const socket = io();

let i = 0;
let s, m, h;
s = m = h = 0;
let listaDozvoljenihPoteza = [];

const room = document.querySelector("#room").innerHTML;
const email = document.querySelector("#email").innerHTML;
const $obaIgraca = document.querySelector("#obaIgraca");
const $messageForm = document.querySelector("#poruke-forma");
const $messageFormButton = document.querySelector("#messageFormButton");
const $messages = document.querySelector("#messages");
const $messageFormInput = document.querySelector("#inputMessage")
let result = document.querySelector("#result").innerHTML;
let numbersOfFigure = document.querySelector("#numbersOfFigure").innerHTML;
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
socket.on('prikaziPartiju',(options) => {

    document.querySelector("#result").innerHTML = options.r;
    document.querySelector("#numbersOfFigure").innerHTML = options.n;
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
    console.log('Ja igram prvi');
    }else{
      console.log('Ja ne igram prvi');
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
   }
  }
});
socket.on('proslediPomeriFiguru',(options) =>{
  document.querySelector('[data-x="'+ options.x1 +'"][data-y="' + options.y1 + '"]').innerHTML = '';
  document.querySelector('[data-x="'+ options.x2 +'"][data-y="' + options.y2 + '"]').innerHTML = options.img;
  //onog trenutka kad primis od drugog igraca njegov potez, tvoj je red. myTurn = true
  document.querySelector('#myTurn').innerHTML = true;
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
        dozvoljeniPoteziQueen(xx, yy, elementiSlikeFigure);
        break;
      case "bishop":
        dozvoljeniPoteziBishop(xx, yy, 8);
        break;
      case "king":
        dozvoljeniPoteziKing(xx, yy, elementiSlikeFigure);
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
  let listaFilter = [];
  listaFilter = listaDozvoljenihPoteza.filter((element) => element.x.toString() === x2.toString() && element.y.toString() === y2.toString());
  
  if(listaFilter.length > 0){
    pomeriFiguru(x1,y1,x2,y2,img,tile);
    removeGreenField();
    removeRedField();
  }
  else{
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
  function pomeriFiguru(x1, y1, x2, y2, img, tile){
    socket.emit('pomeriFiguru',{x1,y1,x2,y2,img});
    returnFirstClickColor();
    document.querySelector("#firstClick").innerHTML = "";
    document.querySelector("#firstClick").setAttribute("id","");
    if(tile.nodeName  === "DIV"){
    tile.innerHTML = img;}
    else{
    tile.parentNode.innerHTML = img;}
    document.querySelector('#myTurn').innerHTML = false;
  }
  function dozvoljeniPoteziPawn(xx, yy, elementiSlikeFigure){
    let list = [];
    let newX = null;
    let newY = null;
    if(elementiSlikeFigure[0].toString() === "B" )
    {   
       newX = xx;
       newY = yy + 1;
      let field = document.querySelector('[data-x="'+ newX +'"][data-y="' + newY + '"]');
      if(field){
        if(!field.children[0]){
          list.push({x:newX,y:newY});
          listaDozvoljenihPoteza.push({x:newX,y:newY});
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
    console.log(listaDozvoljenihPoteza);
    colorInRed(list);
  }
  function colorInRed(list){
    list.forEach(function(currentElement, index) 
    { 
      const element = document.querySelector('[data-x="'+ currentElement.x +'"][data-y="' + currentElement.y + '"]');
      element.style.backgroundColor = '';
      element.setAttribute("id","colorRed");

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
  function dozvoljeniPoteziQueen(xx, yy, elementiSlikeFigure){
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
  function dozvoljeniPoteziKing(xx, yy, elementiSlikeFigure){

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