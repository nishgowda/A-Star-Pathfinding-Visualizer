
var canvas = document.getElementById("mycanvas");
canvas.width = canvas.height = 500;
var ctx = canvas.getContext("2d");
let DIMENSION = 25;
let WIDTH = canvas.width;
let HEIGHT = canvas.height;

let startNodeX = 0;
let startNodeY = 0;
let endNodeX = 0;
let endNodeY = 0;
let startNodeCount = 0;
let count = 0;

$(document).ready(function() {
    $("#startNode").click(function() {
let CANVAS = $("#mycanvas");
let CTX = CANVAS.get(0).getContext("2d");
if (startNodeCount <= 1){
    CANVAS.on('mousemove touchmove touchstart mousedown', mouseFill);
    function mouseFill(e){
        let offsetX = e.offsetX;
        let offsetY = e.offsetY;
        if (e.which != 1) return;
       
        pixel = [Math.floor(offsetX / pixelSize), Math.floor(offsetY / pixelSize)];
        fillPixel(pixel);
        startNodeCount++;
        console.log("START NODE: " + startNodeX + ", " + startNodeY)
        console.log(startNodeCount);
        //console.log(e.which); 
       
    }
    
    function fillPixel(pixel){
        CTX.fillStyle = "#000000";
        CTX.fillRect(pixel[0] * pixelSize, pixel[1] * pixelSize, pixelSize - 1, pixelSize - 1);
        startNodeX += pixel[0];
        startNodeY += pixel[1];
    }
}else{
    console.log("Already a start Node");
}
});

});

$(document).ready(function() {
let CANVAS = $("#mycanvas");
let CTX = CANVAS.get(0).getContext("2d");
$("#endNode").click(function() { 
if (count <= 1){
    CANVAS.on('mousemove touchmove touchstart mousedown', mouseENDFill);
    function mouseENDFill(e){
        let offSetX = e.offsetX;
        let offSetY = e.offsetY;
        if (e.which != 1) return;
       
        endPixel = [Math.floor(offSetX / pixelSize), Math.floor(offSetY / pixelSize)];
        fillEndPixel(endPixel);
        count++;
        window.e = e;
        console.log("END NODE: " + endNodeX + ", " + endNodeY)
        console.log(count);
        //console.log(e.which);
       
    }
    function fillEndPixel(endPixel){
        CTX.fillStyle = "#000000";
        CTX.fillRect(endPixel[0] * endPixel, endPixel[1] * pixelSize, pixelSize - 1, pixelSize - 1);
        
        endNodeX += endPixel[0];
        endNodeY += endPixel[1];
        
    }
}else{
    console.log("Already one end node");
}
});
});

var map, opn = [], clsd = [], start = {x:startNodeX, y:startNodeY, f:0, g:0}, 
goal = {x:8, y:8, f:0, g:0}, mw = 250, mh = 250, neighbours, path;

pixelSize = (WIDTH / DIMENSION);


function findNeighbor(arr , node){
    var a;
    for (let i =0; i<arr.length; i++){
        a = arr[i];
        if (node.x === a.x && node.y === a.y){
            return i;
        }
    }
    return -1;
}

function addNeighbours(currentNode){
    var p;
    for (let i=0; i < neighbours.length; i++){
        var n = {x: currentNode.x + neighbours[i].x, y:currentNode.y + neighbours[i].y, g: 0, h:0, prt: {x:currentNode.x, y:currentNode.y}};
        if (map[n.x][n.y] === 1 || findNeighbor(clsd, n) > -1){
            continue;
        }
        n.g = currentNode.g + neighbours[i].c; 
        n.h = Math.abs(goal.x - n.x) + Math.abs(goal.y - n.y);
        p = findNeighbor(opn, n);
        if (p > -1 && opn[p].g + opn[p].h <= n.g + n.h){
            continue;
        }
        opn.push(n);
    }
    opn.sort(function(a, b){
        return (a.g + a.h) - (b.g + b.h);
    });
}

function createPath(){
    path = [];
    var a, b;
    a = clsd.pop();
    path.push(a);
    while(clsd.length){
        b = clsd.pop();
        if(b.x != a.prt.x || b.y != a.prt.y){
            continue;
        }
        a = b; path.push(a);
    }
}

function solveMap(){
    drawMap();
    if (opn.length < 1){
        document.body.appendChild(document.createElement("p")).innerHTML = "No path!";
        return;
    }
    var currentNode = opn.splice(0, 1)[0];
    clsd.push(currentNode);
    if (currentNode.x == goal.x && currentNode.y == goal.y){
        createPath();
        drawMap();
        return;
    }
    addNeighbours(currentNode);
    requestAnimationFrame(solveMap);
}

function createGrid(){
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < DIMENSION; i++){
        x = Math.floor(i * WIDTH / DIMENSION);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
        
        y = Math.floor(i * HEIGHT / DIMENSION);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }
}
    // Using JQuery for adding Nodes
   

           
         
  
    

function drawMap(){

    for (let i = 0; i < mw; i++){
        for (let j = 0; j < mh; j ++){
        switch(map[i][j]){
            case 0:
                continue;
            case 1:
                ctx.fillStyle = "#990";
                break;
            case 2:
                ctx.fillStyle = "#090";
                break;
            case 3:
                ctx.fillStyle = "#900";
                break;
        }
        //ctx.fillRect(i , j , pixelSize, pixelSize);
        }
    }
    var a;
    if (path.length){
        var txt = "Path: " + (path.length - 1) + "<br />[";
        for (let i = path.length - 1; i > -1; i --){
            a = path[i];
            ctx.fillStyle = "#66ff00";
            ctx.fillRect(a.x * pixelSize, a.y * pixelSize, pixelSize, pixelSize);
            txt += "(" + a.x + ", " + a.y + ") ";
        }
        document.body.appendChild(document.createElement("p")).innerHTML = txt + "]";
        return;
    }
    for (let i = 0; i< opn.length; i++){
        a = opn[i];
        ctx.fillStyle = "#909";
        ctx.fillRect(a.x * pixelSize, a.y * pixelSize , pixelSize, pixelSize);
    }
    for (let i= 0; i< clsd.length; i++){
        a = clsd[i];
        ctx.fillStyle = "#009";
        ctx.fillRect(a.x * pixelSize, a.y * pixelSize, pixelSize, pixelSize);
    }
}

function createMap(){
    map = new Array(mw);
    for (let i = 0; i< mw; i++){
        map[i] = new Array(mh);
        for (let j = 0; j < mh; j++){
            if (!i || !j || i == mw -1 || j == mh -1){
                map[i][j] = 1;
            }else{
                map[i][j] = 0;
            }
        }
    }
    map[5][3] = map[6][3] = map[7][3] = map[3][4] = map[7][4] = map[3][5] = 
    map[7][5] = map[3][6] = map[4][6] = map[5][6] = map[6][6] = map[7][6] = 1;
}

function init(){
    document.clear();
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    console.log(start)
    neighbours = [
        {x:1, y:0, c:1}, {x:-1, y:0, c:1}, {x:0, y:1, c:1}, {x:0, y:-1, c:1}, 
        {x:1, y:1, c:1.4}, {x:1, y:-1, c:1.4}, {x:-1, y:1, c:1.4}, {x:-1, y:-1, c:1.4}
    ];
    path = []; createMap(); opn.push( start ); solveMap();
    
}