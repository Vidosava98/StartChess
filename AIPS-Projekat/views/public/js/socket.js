const socket = io();


const room = document.querySelector("#room").innerHTML;
const email = document.querySelector("#email").innerHTML;
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
});