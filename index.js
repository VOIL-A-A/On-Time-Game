//How to play Button
let moreinfo = document.getElementById('moreInfo');

function pop() {
    alert('test');
}
moreinfo.addEventListener('click', pop);

//Start Button
let startButton = document.getElementById('start');

startButton.addEventListener('click', Remove);

let body = document.getElementById('body');

//Remove Function
function Remove() {
    let bodyChildren = body.children;
    for(let i = 0; i < bodyChildren.length;i){
        bodyChildren[i].remove();
    }
}

startButton.addEventListener('click', character)

//Character
function character(){
kaboom({
    width: 320,
    height: 240,
    font: 'sinko',
	stretch: true,
	letterbox: false,
    canvas: document.querySelector('#mycanvas'),
    background: [ 0, 0, 255, ],
})

}
//Walking


//function for walking

function walking(){
    
}

//