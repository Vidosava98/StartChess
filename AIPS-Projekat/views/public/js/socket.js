const socket = io();

let i = 0;
let s, m, h;
s = m = h = 0;

const room = document.querySelector("#room").innerHTML;
const email = document.querySelector("#email").innerHTML;
const $obaIgraca = document.querySelector("#obaIgraca");
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
socket.emit('join', { email: email, room : room.toString()}, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
});
socket.on('prikaziPartiju',(options) => {

    document.querySelector("#result").innerHTML = options.r;
    document.querySelector("#numbersOfFigure").innerHTML = options.n;
    document.querySelector('#vreme').innerHTML = options.d;
    $obaIgraca.insertAdjacentHTML('beforeend', `<div class="card" style="width:20%; background-color: lightgray; margin:5%">
    <div class="card-body">
      <h5>Opis igrača</h5>
      <h5 class="card-title">${options.user1.name}</h5>
      <p class="card-text">${options.user1.email}</p>
       <div class="card-text">
         Datum prijave: ${options.user1.date}
       </div> 
       <div class="card-text">
       Poslednja odigrana partija: ${options.user1.lastConnection}
       </div> 
    </div>
    </div>`);
    $obaIgraca.insertAdjacentHTML('beforeend', `<div class="card" style="width:20%; background-color: lightgray; margin:5%">
    <div class="card-body">
        <h5>Opis igrača</h5>
        <h5 class="card-title">${options.user2.name}</h5>
        <p class="card-text">${options.user2.email}</p>
        <div class="card-text">
        Datum prijave: ${options.user2.date}
        </div> 
        <div class="card-text">
        Poslednja odigrana partija: ${options.user2.lastConnection}
        </div> 
    </div>
    </div>`);
  setInterval(myGreeting, 1000);
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


