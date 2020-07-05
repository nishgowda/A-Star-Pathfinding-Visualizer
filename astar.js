$(document).ready(function() {
let canvas = $("#mycanvas");
let ctx = canvas.get(0).getContext("2d");
let DIMENSION = 40;
let WIDTH = canvas.width();
let HEIGHT = canvas.height();
console.log(WIDTH / DIMENSION);
pixelSizeX = Math.ceil(WIDTH / DIMENSION);
pixelSizeY = Math.ceil(HEIGHT / DIMENSION);
let startNodeX;
let startNodeY;
let endNodeX;
let endNodeY;
let startNodeCount = 0;
let count = 0;
var start, goal, map, opn = [], clsd = [], mw = 400, mh = 400, neighbours, path;

SELECTEDBOX = null;
console.log(pixelSizeX);
console.log(pixelSizeY);
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
// Checks if the current node is a neighbor
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
// Checks if the current node is a wall
function findWall(node){
    for (let i = 0; i < walls.length; i ++){
        if (walls[i].x == node.x && walls[i].y == node.y){
            return i;
        }
    }
    return -1;
}


function addNeighbours(currentNode){
    var p;
    for (let i=0; i < neighbours.length; i++){
        var n = {x: currentNode.x + neighbours[i].x, y:currentNode.y + neighbours[i].y, g: 0, h:0, prt: {x:currentNode.x, y:currentNode.y}};
        // if current node x and y dist are not the same or if the node is not a neighbor or if node is  not a wall
        if (map[n.x][n.y] === 1 || findNeighbor(clsd, n) > -1 || findWall(n) > -1){
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




    // Using JQuery for adding Nodes
    let startENABLED = true;
        $("#startNode").click(function() { 
            canvas.mousemove(function(e){
                let pixel = [Math.floor(e.offsetX / (pixelSizeX)), Math.floor(e.offsetY / (pixelSizeY))];
                if (!SELECTEDBOX){
                    SELECTEDBOX = $("<div id=selectedBox></div>");
                    SELECTEDBOX.css({width: pixelSizeX - 2, height:  pixelSizeY -2});
                    $("#mycanvasWrapper").prepend(SELECTEDBOX);
                }
                SELECTEDBOX.css({
                    left: pixel[0] * pixelSizeX + 1,
                    top: pixel[1] * pixelSizeY
                });
            });


            canvas.on('mousemove touchmove touchstart mousedown', mouseFill);
            function mouseFill(e){
                e.preventDefault()
                if (!startENABLED) return;
                let offsetX = e.offsetX;
                let offsetY = e.offsetY;
                if (e.which != 1) return;
                pixel = [Math.floor(offsetX / pixelSizeX), Math.floor(offsetY / pixelSizeY)];
                fillPixel(pixel);
                startNodeCount++;
                
                console.log("START NODE: " + startNodeX + ", " + startNodeY)
                console.log(startNodeCount);
                startENABLED = false;
            }
            
            function fillPixel(pixel){
                ctx.fillStyle = "#0275d8";
                ctx.fillRect(pixel[0] * pixelSizeX, pixel[1] * pixelSizeY, pixelSizeX - 1, pixelSizeY - 1);
                startNodeX = pixel[0];
                startNodeY  = pixel[1];
            }
       
        console.log(startENABLED);
             
    });
    
    let endENABLED = true;
    $("#endNode").click( function() { 
        canvas.mousemove(function(e){
            let pixel = [Math.floor(e.offsetX / (pixelSizeX)), Math.floor(e.offsetY / (pixelSizeY))];
            if (!SELECTEDBOX){
                SELECTEDBOX = $("<div id=selectedBox></div>");
                SELECTEDBOX.css({width: pixelSizeX - 2, height:  pixelSizeY -2});
                $("#mycanvasWrapper").prepend(SELECTEDBOX);
            }
            SELECTEDBOX.css({
                left: pixel[0] * pixelSizeX + 1,
                top: pixel[1] * pixelSizeY
            });
        }); 
            canvas.on('mousemove touchmove touchstart mousedown', mouseFill);
            function mouseFill(e){
                e.preventDefault()
                if (!endENABLED) return;
                let offsetX = e.offsetX;
                let offsetY = e.offsetY;
                if (e.which != 1) return;
                pixel = [Math.floor(offsetX / pixelSizeX), Math.floor(offsetY / pixelSizeY)];
                fillPixel(pixel);
                count++;
                //window.e = e;
                console.log("END NODE: " + endNodeX + ", " + endNodeY)
                console.log(count);
                endENABLED = false;
                //console.log(e.which);
            }
            function fillPixel(pixel){
                ctx.fillStyle = "#d9534f";
                ctx.fillRect(pixel[0] * pixelSizeX, pixel[1] * pixelSizeY, pixelSizeX - 1, pixelSizeY - 1);      
                endNodeX= pixel[0];
                endNodeY = pixel[1];  
            }
        
        console.log(endENABLED);
    });

    // Function to draw walls in grid.
    let walls = []
    $("#walls").click( function(){
        canvas.mousemove(function(e){
            let pixel = [Math.floor(e.offsetX / (pixelSizeX)), Math.floor(e.offsetY / (pixelSizeY))];
            if (!SELECTEDBOX){
                SELECTEDBOX = $("<div id=selectedBox></div>");
                SELECTEDBOX.css({width: pixelSizeX - 2, height:  pixelSizeY -2});
                $("#mycanvasWrapper").prepend(SELECTEDBOX);
            }
            SELECTEDBOX.css({
                left: pixel[0] * pixelSizeX + 1,
                top: pixel[1] * pixelSizeY
            });
        });
        canvas.on('mousemove touchmove touchstart mousedown', mouseFill);
        function mouseFill(e){
            if (Object.keys(walls) > 20) return;
            let offsetX = e.offsetX;
            let offsetY = e.offsetY;
            if (e.which != 1) return;
            pixel = [Math.floor(offsetX / pixelSizeX), Math.floor(offsetY / pixelSizeY)];
            fillPixel(pixel);
            //console.log(wallsX + " " + wallsY);

        }
        function fillPixel(pixel){
            ctx.fillStyle = "#000000";
            ctx.fillRect(pixel[0] * pixelSizeX, pixel[1] * pixelSizeY, pixelSizeX - 1, pixelSizeY - 1);
            walls.push({
                x : pixel[0],
                y : pixel[1]
            });        
        }
        
    });

function drawMap(){
    var a;
    if (path.length){
        var txt = "Path: " + (path.length - 1) + "<br />[";
        for (let i = path.length - 1; i > -1; i --){
            a = path[i];
            ctx.fillStyle = "#00FF7F";
            ctx.fillRect(a.x * pixelSizeX, a.y * pixelSizeY, pixelSizeX, pixelSizeY);
            txt += "(" + a.x + ", " + a.y + ") ";
        }

        document.body.appendChild(document.createElement("p")).innerHTML = txt + "]";
        return;
    }
    for (let i = 0; i< opn.length; i++){
        a = opn[i];
        ctx.fillStyle = "#FF6347";
        ctx.fillRect(a.x * pixelSizeX, a.y * pixelSizeY , pixelSizeX, pixelSizeY);
    }
    for (let i= 0; i< clsd.length; i++){
        a = clsd[i];
        ctx.fillStyle = "#8B0000";
        ctx.fillRect(a.x * pixelSizeX, a.y * pixelSizeY, pixelSizeX, pixelSizeY);
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





$("#run").click(function() {
    if (startNodeCount > 0 && count > 0) {
        console.log(walls);
        start = {x:startNodeX, y:startNodeY, f:0, g:0};
        goal = {x:endNodeX, y:endNodeY, f:0, g:0};
        //console.log("THE START NODE COUNT IS: " + startNodeCount);
        console.log(start)
        console.log(goal)
        neighbours = [
            {x:1, y:0, c:1}, {x:-1, y:0, c:1}, {x:0, y:1, c:1}, {x:0, y:-1, c:1}, 
            {x:1, y:1, c:1.4}, {x:1, y:-1, c:1.4}, {x:-1, y:1, c:1.4}, {x:-1, y:-1, c:1.4}
        ];
       // console.log(neighbours);
        path = []; createMap(); opn.push( start ); solveMap();
    }
    });

});
