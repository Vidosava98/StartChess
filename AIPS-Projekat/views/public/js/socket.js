const socket = io();

let i = 0;
let s, m, h;
s = m = h = 0;

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
    console.log(email2);
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
        <div class="card-text">
        Datum prijave: ${moment(options.user2.date).format('D.M.YYYY HH:mm')}
        </div> 
        <div class="card-text">
        Poslednja partija: ${moment(options.user2.lastConnection).format('D.M.YYYY HH:mm')}
        </div> 
    </div>
    </div>`);
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
  console.log(e.target);
  let x = 0;
  let y = 0;
  if(document.querySelector("#firstClick") === null){
  if(e.target.nodeName  === "DIV"){
    //if it is div you can get Atribute data-x and data-y
     x = tile.getAttribute("data-x");
     y = tile.getAttribute("data-y");
     console.log("if:", x, y);
  }else{
    //if it is img, you should get  parrent node first
    x = tile.parentNode.getAttribute("data-x");
    y = tile.parentNode.getAttribute("data-y");
    tile.parentNode.style.backgroundColor = "#f5f3dade";
    tile.parentNode.setAttribute("id", "firstClick");
    console.log("else:" ,x, y);
    //funkcija koja ce logikom dati koja polja su moguca za kliknuti
  }
}else{
  console.log("Ovo je drugi click");
  if( document.querySelector("#firstClick").getAttribute("class").trim().toLowerCase() === "b")
  { document.querySelector("#firstClick").style.backgroundColor = "#bbc8f0"; }
  else
  { document.querySelector("#firstClick").style.backgroundColor = "#FFF"; }
  
  const img = document.querySelector("#firstClick").innerHTML;
  document.querySelector("#firstClick").innerHTML = "";
  if(e.target.nodeName  === "DIV"){
    tile.innerHTML = img;
  }else{
    tile.parentNode.innerHTML = img;
  }
  document.querySelector("#firstClick").setAttribute("id","");
}
  //Proveriti koja polja su dostupna, tj na koja polja se moze pomeriti ta figura
  //postaviti to polje na first click
  //svaki put kad se klikne na neko polje pita se da li na tabli postoji div sa klasom prvi klik
  //ako ne postoji onda se radi ovo sve
  //ako postoji prvi klik onda je to drugi klik sto znaci da je to tek pomeraj, pa ovo polje
  // treba da se ocisti a to neko drugo da postane sa tom figurom
  //ali pre toga mora da se vrse provere i ako je dozvoljena promena na to polje
  //i posalje se drugom useru x i y za first click i za taj novi click
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


