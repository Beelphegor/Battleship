/// <reference path="AI.Core.js" />
/// <reference path="Battleship.Core.js" />

function CrueltyAndTheBeast() { }
AI.subClass(CrueltyAndTheBeast);

CrueltyAndTheBeast.prototype.setupBoard = function setupBoard(ships) {
    var board = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],
        placements = [],
        myShips = [],
        currentShip,
        placeVertical,
        xBoardLength, yBoardLength,
        valid,
        x, y,
        start, end,
        i, j;

    // ships = 2, 3, 3, 4, 5
    for (i = 0; i < ships.length; i++) {
        myShips.push(ships[i]);
    }

    // place the longest ship remaining randomly
    while (myShips.length > 0) {
        currentShip = 0;
        for (i = 0; i < myShips.length; i++) {
            currentShip = Math.max(currentShip, myShips[i]);
        }
        myShips.splice(myShips.indexOf(currentShip), 1);

        // decide whether to place ship vertically or horizontally
        placeVertical = Math.floor(Math.random() * 2);
        xBoardLength = 10;
        yBoardLength = 10;

        if (placeVertical) yBoardLength -= (currentShip - 1);
        else xBoardLength -= (currentShip - 1);

        // try placing the ship 5 times before giving up
        for (i = 0; i < 5; i++) {
            valid = true;

            x = Math.floor(Math.random() * xBoardLength);
            y = Math.floor(Math.random() * yBoardLength);

            start = new Battleship.Point(x, y);

            for (j = 0; j < currentShip; j++) {
                if (placeVertical) {
                    if (board[x][y + j] === 1) valid = false;
                } else {
                    if (board[x + j][y] === 1) valid = false;
                }
            }

            if (valid) {
                if (placeVertical) end = new Battleship.Point(x, y + j - 1);
                else end = new Battleship.Point(x + j - 1, y);

                for (j = 0; j < currentShip; j++) {
                    if (placeVertical) board[x][y + j] = 1;
                    else board[x + j][y] = 1;
                }

                placements.push(new Battleship.Placement(start, end));
                break;
            }
        }

        if (!valid) {
            throw new Error("Failed to place all pieces!");
        }
    }

    return placements;
};

CrueltyAndTheBeast.prototype.fire = function fire(myMoves, theirMoves) {
    var doRandomMove = function(){
        var randomX;
        var randomY;

        while(!isValidPoint(randomX, randomY)){
            randomX = Math.floor(Math.random() * 10);
            randomY = Math.floor(Math.random() * 10);   
        }
        return new Battleship.Point(randomX, randomY);
    }

    var isFirstMove = function(){
        if(myMoves.length === 0){
            return true;
        }else{
            return false;
        }
    }

    var doMoveOnAdjacentPoint = function(){
            
        if(lastMove().x !== 9 && isValidPoint(lastMove().x + 1, lastMove().y)){
            return new Battleship.Point(lastMove().x + 1, lastMove().y);
        } else if (lastMove().x !== 0 && isValidPoint(lastMove().x - 1, lastMove.y)){
            return new Battleship.Point(lastMove().x - 1, lastMove().y);
        } else if (lastMove().y !== 9 && isValidPoint(lastMove().x, lastMove().y + 1)){
            return new Battleship.Point(lastMove().x, lastMove().y + 1);
        } else if (lastMove().y !== 0 && isValidPoint(lastMove().x, lastMove().y - 1)){
            return new Battleship.Point(lastMove().x, lastMove().y - 1)
        }else {
            return doRandomMove();
        }

    };

    var lastMove = function(){
        return myMoves[myMoves.length - 1];
    }

    var isValidPoint = function(x, y){
        if(x > 9 || x < 0)
            return false;
        if(y > 9 || y < 0)
            return false;
        for(var j = 0; j < global.movesDone.length; j++){            
            if(global.movesDone[j].x == x && global.movesDone[j].y == y)
                return false;
        }

        for(var i = 0; i < global.movesDone.length; i++){
            if(myMoves.length > 0){
                if(myMoves[i].x != global.movesDone[i].x || myMoves[i].y != global.movesDone[i].y)
                    console.log("fok");

            }
        }
        return true;
    }

    

    if(isFirstMove()){
        global.movesDone = [];
        move = doRandomMove();

    } else if(lastMove().isHit){
        move = doMoveOnAdjacentPoint();
    } else {
        move = doRandomMove();
    }
    global.movesDone.push(move);
    return move;
}


