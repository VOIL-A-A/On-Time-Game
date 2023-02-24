//How to play Button
let moreinfo = document.getElementById('moreInfo');

function pop() {
    alert('test');
}
moreinfo.addEventListener('click', pop);

//Start Button
let start = document.getElementById('start');

start.addEventListener('click', Remove);

let body = document.getElementById('body');

//Remove Function
function Remove() {
    let bodyChildren = body.children;
    for(let i = 0; i < bodyChildren.length;i){
        bodyChildren[i].remove();
    }
}

//Walking


//function for walking

function walking(){
    
}

//