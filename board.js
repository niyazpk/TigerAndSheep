// constants
const EMPTY = 0;
const TIGER = 1;
const SHEEP = 2;
const INFINITY = 99999;
const DEPTH = 1;

var numSheepsInBasket = 10;
var numSheepKilled = 0;
var bestMove = [];

var board = [
    [TIGER, 0, 0, 0, TIGER],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [TIGER, 0, 0, 0, TIGER]
];

function drawBoard(){
    var html= "<table>";
    for(var x=0; x<5; x++){
		html += "<tr>";
		for(var y=0; y<5; y++){
		    class = "item-" + board[x][y];
		    html += "<td x="+x+" y="+y+" class='"+class+"'>" + board[x][y] + "</td>";
		}
		html += "</tr>";
    }
    html += "</table>";
    $('body').html(html);
}

function isValidMove(x,y){
    if(numSheepsInBasket > 0){
		if(board[x][y] != EMPTY){
		    return false;
		}
	}else{
		return false;
	}
    return true;
}

function moveTiger(){
	bestMove = [];
    var alpha = -INFINITY;
    var beta = INFINITY;
    alphabeta(DEPTH, alpha, beta);
    makeMove(bestMove);
    drawBoard();
}

function isTigersMove(depth){
    if( (DEPTH-depth) % 2 == 0){
		return true;
    }else{
		return false;
    }
}

function isPointInsideBoard(point){

    x =	point[0];
    y = point[1];
    
    if(x>=0 && y>=0 && x<=4 && y<=4){
		return true;
    }else{
		return false;
    }
}

// Returns the possible ( <= 4 or 8) moves that a piece can do from the given position
function possibleMoveDirectionsFrom(x,y){
    var directions = [
		[x-1,y],
		[x+1,y],
		[x,y-1],
		[x,y+1]
    ];
    
    if(	(x+y) % 2 == 0){   //diagonal movement is allowed from only these points
		directions.push( 
		    [x-1,y-1],
		    [x-1,y+1],
		    [x+1,y-1],
		    [x+1,y+1]
		);
    }
    
    directions = directions.filter(isPointInsideBoard);
    
    return directions;
}

// Returns the possible ( <= 4 or 8) captures that a piece can do from the given position
function possibleCaptureDirectionsFrom(x,y){
    var directions = [
		[x-2,y],
	    [x+2,y],
	    [x,y-2],
	    [x,y+2]
    ];
    
    if(	(x+y) % 2 == 0){   //diagonal movement is allowed from only these points
		directions.push( 
		    [x-2,y-2],
		    [x-2,y+2],
		    [x+2,y-2],
		    [x+2,y+2]
		);
    }
    
    directions = directions.filter(isPointInsideBoard);
    
    return directions;
}




// Returns the possible *valid* moves that a tiger can make from the given position
// In addition to moves from possibleValidSheepMovesFrom(x,y) this includes capturing sheeps.
function possibleValidTigerMovesFrom(x,y){

	// Find out Normal moves - these are the same moves that a sheep can make
	var validMoves = possibleValidSheepMovesFrom(x,y);

	// Find out Capture moves
	if(validMoves.length){ // If the tiger is blocked from all sides, it cannot capture.
		var directions = possibleCaptureDirectionsFrom(x,y);
	    
	    // Validate the Moves
	    for(d in directions){
			if(isCaptureValid([x,y],directions[d])){
				validMoves.push([x, y, directions[d][0], directions[d][1]]);
			}
		}
    }
    return validMoves;
}

// Returns the possible *valid* moves that a sheep can make from the given position
function possibleValidSheepMovesFrom(x,y){

	var directions = possibleMoveDirectionsFrom(x,y);
	var validMoves = [];
	
	// Validate the Moves
	for(d in directions){
		if(isUnOccupied(directions[d])){
			validMoves.push([x, y, directions[d][0], directions[d][1]]);
		}
	}
	
	return validMoves;
}

function generateMoves(depth){

	var moveslist = [];

	if(isTigersMove(depth)){
		for(var x=0; x<5; x++){
		    for(var y=0; y<5; y++){
				if(board[x][y] == TIGER){
				    moveslist = moveslist.concat(possibleValidTigerMovesFrom(x,y));
				}		
		    }
		}
    }else if(numSheepsInBasket > 0){
    	for(var x=0; x<5; x++){
		    for(var y=0; y<5; y++){
				if(board[x][y] == EMPTY){
				    moveslist = moveslist.concat([[x,y,x,y]]);
				}
		    }
		}
    }else{
    	for(var x=0; x<5; x++){
		    for(var y=0; y<5; y++){
				if(board[x][y] == SHEEP){
				    moveslist = moveslist.concat(possibleValidSheepMovesFrom(x,y));
				}
		    }
		}
    }

    
    return moveslist;
}

function makeMove(move){

	if(move[0] == move[2] && move[1] == move[3]){
		board[move[2]][move[3]] = SHEEP;
		numSheepsInBasket -= 1;
		return;
	}
	
	board[move[2]][move[3]] = board[move[0]][move[1]]; // move the piece
	board[move[0]][move[1]] = EMPTY;
	
	if( Math.abs(move[0]-move[2]) == 2 || Math.abs(move[1]-move[3]) == 2 ){  // capture if needed
		midX = move[0] + (move[2] - move[0])/2;
		midY = move[1] + (move[3] - move[1])/2;
		board[midX][midY] = EMPTY;
	}
}

function unMakeMove(move){
	
	if(move[0] == move[2] && move[1] == move[3]){
		board[move[2]][move[3]] = EMPTY;
		numSheepsInBasket += 1;
		return;
	}
	
	board[move[0]][move[1]] = board[move[2]][move[3]]; // move the piece back to the original position
	board[move[2]][move[3]] = EMPTY;
	
	if( Math.abs(move[0]-move[2]) == 2 || Math.abs(move[1]-move[3]) == 2 ){  // put the captured piece back (if any)
		midX = move[0] + (move[2] - move[0])/2;
		midY = move[1] + (move[3] - move[1])/2;
		board[midX][midY] = SHEEP;
	}
}


// Is the given Capture from fromPoint to toPoint valid?
function isCaptureValid(fromPoint, toPoint){
	if( ! isUnOccupied(toPoint)){ // You can move only to an empty spot
		return false;
	}

	var middlePoint = 	[  // This is the position of the piece being captured
		fromPoint[0] + (toPoint[0] - fromPoint[0])/2, 	
		fromPoint[1] + (toPoint[1] - fromPoint[1])/2
		];
	
	if(board[middlePoint[0]][middlePoint[1]] != SHEEP){ // You can only capture if there is a sheep to capture!
		return false;
	}
	
	return true;
}


// Is the given point occupied by any piece?
function isUnOccupied(point){

    x =	point[0];
    y = point[1];
    
    if(board[x][y] == EMPTY){
		return true;
    }else{
		return false;
    }
}

function areAllTigersBlocked(){
    for(var x=0; x<5; x++){
		for(var y=0; y<5; y++){
		    if(board[x][y] == TIGER){
				if(canMove(x,y)){
				    return false;
				}
		    }		
		}
    }
    return true;
}

function tooManySheepsAreKilled(){
    if(numSheepKilled >= 5){
		return true;
    }else{
		return false;
    }
}


// Is the current game position and end-game position?
function isTerminal(){
    if (areAllTigersBlocked() || tooManySheepsAreKilled()){
		return true;
    }else{
		return false;
    }
}

// Can this piece move from this poistion to any adjascent space?
// Note that a Tiger cannot move above a sheep if the Tiger is blocked in all positions.
function canMove(x,y){
    var directions = possibleMoveDirectionsFrom(x,y);
    return directions.some(isUnOccupied);
}

function evaluate(depth){
	var value = 0;
    var numSheep = 0;
    var numMovableTiger = 0;
    for(var x=0; x<5; x++){
		for(var y=0; y<5; y++){
		    if(board[x][y] == TIGER){
				if(canMove(x,y)){
				    numMovableTiger += 10;
				}
		    }else if(board[x][y] == SHEEP){
				numSheep += 10;
		    }		
		}
    }
    
    if (tooManySheepsAreKilled()){
		value -= 1000;
    }
	if (areAllTigersBlocked()){
		value += 1000;
	}
        
    value += numSheep - numMovableTiger;
	//value = isTigersMove(depth) ? -value : value;
    //console.log(value);
    return value;
}

function alphabeta( depth, alpha, beta){
    if(isTerminal() || depth == 0)
		return evaluate(depth);
	
	var moves = generateMoves(depth);
	
    for(var i = 0; i < moves.length; i++){
    

    
		makeMove(moves[i]);
		v = -alphabeta( depth-1, -beta, -alpha);
		
		if(depth == DEPTH){
			console.log(moves[i]);
			console.log(v);
		}
		
		if(v > alpha){
			alpha = v;
			if(depth == DEPTH){
				bestMove = moves[i];
			}
		}
		unMakeMove(moves[i]);
		if(beta <= alpha){break;}
    }
    return alpha;
}

$(document).ready(function(){
	    drawBoard();
	    $('td').live('click',function(){
		x = parseInt($(this).attr('x'));
		y = parseInt($(this).attr('y'));
		if(isValidMove(x,y)){
		    board[x][y] = SHEEP;
		    drawBoard();
		    numSheepsInBasket -= 1;
		    setTimeout("moveTiger()", 10);
		}
    });
});
