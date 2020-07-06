/* @file: astar.js
   @author: Nish Gowda
   @date: 07/05/2020
   @about: This file includes both the UI and the
   astar algorithm implementation, which finds the 
   closest path between two nodes.
*/

$(document).ready(function() {
let canvas = $("#mycanvas");
let ctx = canvas.get(0).getContext("2d");
let DIMENSION = 40;
let WIDTH = canvas.width();
let HEIGHT = canvas.height();

pixelSizeX = Math.ceil(WIDTH / DIMENSION);
pixelSizeY = Math.ceil(HEIGHT / DIMENSION);
let startNodeX;
let startNodeY;
let endNodeX;
let endNodeY;

var startNode, targetNode, map, openSet = [], closedSet = [], mapWidth = DIMENSION, mapHeight = DIMENSION, neighbors, path;
SELECTEDBOX = null;

// Draw out the opening grid where users can add a start node, end node, and walls
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

// Finds the neighbors of the current Node and add them to the openSet
function addNeighbors(currentNode){
    var p;
    for (let i=0; i < neighbors.length; i++){
        var n = {x: currentNode.x + neighbors[i].x, y:currentNode.y + neighbors[i].y, g: 0, h:0, prt: {x:currentNode.x, y:currentNode.y}};
        // if current node x and y dist are not the same or if the node is not a neighbor or if node is  not a wall
        if (map[n.x][n.y] === 1 || findNeighbor(closedSet, n) > -1 || findWall(n) > -1){
            continue;
        }
        n.g = currentNode.g + neighbors[i].c; 
        n.h = Math.abs(targetNode.x - n.x) + Math.abs(targetNode.y - n.y);
        p = findNeighbor(openSet, n);
            if (p > -1 && openSet[p].g + openSet[p].h <= n.g + n.h){
                continue;
            }
            openSet.push(n);
        }
        openSet.sort(function(a, b){
            return (a.g + a.h) - (b.g + b.h);
        }); 
    }



// Creates the path for the two nodes 
function createPath(){
    path = [];
    var a, b;
    a = closedSet.pop();
    path.push(a);
    while(closedSet.length){
        b = closedSet.pop();
            if(b.x != a.prt.x || b.y != a.prt.y){
                continue;
       }
        a = b; path.push(a);

    }
}

// Solves the path of the two nodes. 
// If the openSet is less then one, then we end up with no path
// else create the path and visualize it
function solveMap(){
    drawMap();
    if (openSet.length < 1){
        document.body.appendChild(document.createElement("p")).innerHTML = "No path!";
        return;
    }
    var currentNode = openSet.splice(0, 1)[0];
    closedSet.push(currentNode);

    if (currentNode.x == targetNode.x && currentNode.y == targetNode.y){
        createPath();
        drawMap();
        return;
    }
    addNeighbors(currentNode);
    requestAnimationFrame(solveMap);
}




    // Using JQuery to allow the user to add the start 
    // and end node to the board, as well as create the
    // selector for the mouse cursor and prepend it to 
    // the wrapper div in HTML
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
            endENABLED = false;

        }
        function fillPixel(pixel){
            ctx.fillStyle = "#d9534f";
            ctx.fillRect(pixel[0] * pixelSizeX, pixel[1] * pixelSizeY, pixelSizeX - 1, pixelSizeY - 1);      
            endNodeX= pixel[0];
            endNodeY = pixel[1];  
        }
    
    console.log(endENABLED);
});

    // Using JQuery to allow the user to create and draw
    // walls on the grid and appends the created walls to an 
    // array by grabbing the x and y coordinate of the filled pixel
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

// Given a solved path, draw the path by filling rect given the pixel
// coordinates. Along with the path, the closed and open set are drawn
// as well.
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
    for (let i = 0; i< openSet.length; i++){
        a = openSet[i];
        ctx.fillStyle = "#FF6347";
        ctx.fillRect(a.x * pixelSizeX, a.y * pixelSizeY , pixelSizeX, pixelSizeY);
    }
    for (let i= 0; i< closedSet.length; i++){
        a = closedSet[i];
        ctx.fillStyle = "#8B0000";
        ctx.fillRect(a.x * pixelSizeX, a.y * pixelSizeY, pixelSizeX, pixelSizeY);
    }
}
// Given the dimensions of the map, we create the map that our
// drawMap() and solveMap will use to actually solve and draw on.
function createMap(){
    map = new Array(mapWidth);
    for (let i = 0; i< mapWidth; i++){
        map[i] = new Array(mapHeight);
        for (let j = 0; j < mapHeight; j++){
            if (!i || !j || i == mapWidth -1 || j == mapHeight -1){
                map[i][j] = 1;
            }else{
                map[i][j] = 0;
            }
        }
    }
    map[5][3] = map[6][3] = map[7][3] = map[3][4] = map[7][4] = map[3][5] = 
    map[7][5] = map[3][6] = map[4][6] = map[5][6] = map[6][6] = map[7][6] = 1;
}

// The run function, given a click even with JQuery, when the user 
// adds a start and end node (also walls if they wish), then we run the algorithm.
$("#run").click(function() {
        console.log(walls);
        startNode = {x:startNodeX, y:startNodeY, f:0, g:0};
        targetNode = {x:endNodeX, y:endNodeY, f:0, g:0};

        neighbors = [
            {x:1, y:0, c:1}, {x:-1, y:0, c:1}, {x:0, y:1, c:1}, {x:0, y:-1, c:1}, 
            {x:1, y:1, c:1.4}, {x:1, y:-1, c:1.4}, {x:-1, y:1, c:1.4}, {x:-1, y:-1, c:1.4}
        ];

        path = []; createMap(); openSet.push( startNode ); solveMap();
    
    });

});
