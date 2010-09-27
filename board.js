// constants
const TIGER = 1;
const SHEEP = 2;
const INFINITY = 99999;
const DEPTH = 4;

var tigersTurn = false;
var numSheepsInBasket = 10;
var numSheepKilled = 0;
var moves = [];

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
	if(board[x][y] != 0){
	    return false;
	}
    }else{
	return false;
    }
    return true;
}

function moveTiger(){
    //evaluate();
    var alpha = -INFINITY;
    var beta = INFINITY;
    possibleValidTigerMovesFrom(0,0);
    alphabeta(board, DEPTH, alpha, beta);
}

function isTigersMove(depth){
    if( (DEPTH-depth) % 2 == 0){
	return true;
    }else{
	return false;
    }
}

function movesFromHere(x,y){
    if(	
	isUnOccupied(x-1,y) ||
	    isUnOccupied(x+1,y) ||
	    isUnOccupied(x,y-1) ||
	    isUnOccupied(x,y+1)
    ){
	return true;
    }
    
    // Is diagonal movement possible?
    if(	((x+y) % 2 == 0) && (  //diagonal movement is allowed from only these points
		isUnOccupied(x-1,y-1) ||
		    isUnOccupied(x-1,y+1) ||
		    isUnOccupied(x+1,y-1) ||
		    isUnOccupied(x+1,y+1) )
	      ){
		return true;
    }
    
}


// Returns the possible (4 or 8) moves that a piece can do from the given position
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
    return directions;
}

// Returns the possible *valid* moves that a tiger can make from the given position
// In addition to moves from possibleMoveDirectionsFrom(x,y) this includes capturing sheeps.
function possibleValidTigerMovesFrom(x,y){


	// Find out Normal moves
	var directions = possibleMoveDirectionsFrom(x,y);
	var validMoves = [];
	
	// Validate the Moves
	for(d in directions){
		if(isUnOccupied(directions[d])){
			validMoves.push(directions[d]);
		}
	}
	
	directions = [];

	// Find out Capture moves
	if(validMoves.length){ // If the tiger is blocked from all sides, it cannot capture.
		directions.push( 
		    [x-2,y],
		    [x+2,y],
		    [x,y-2],
		    [x,y+2]
		);
	    
	    if(	(x+y) % 2 == 0){   //diagonal movement is allowed from only these points
			directions.push( 
			    [x-2,y-2],
			    [x-2,y+2],
			    [x+2,y-2],
			    [x+2,y+2]
			);
	    }
	    
	    // Validate the Moves
	    for(d in directions){
			if(isCaptureValid([x,y],directions[d])){
				validMoves.push(directions[d]);
			}
		}
    }
	console.log(validMoves);
    return validMoves;
}


function tigerCanMoveTo(){
	
}

function generateMoves(){
	if(isTigersMove()){
		for(var x=0; x<5; x++){
		    for(var y=0; y<5; y++){
				if(board[x][y] == TIGER){
				    if(canMove(x,y)){
						if(isUnOccupied(x-1,y)){
						    moves.push([x, y, x-1, y]);
						}
						if(isUnOccupied(x-1,y)){
						    moves.push([x, y, x-1, y]);
						}
				    }
				}		
		    }
		}
    }
}

function makeMove(){

}

function unMakeMove(){

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
    
    if(x>=0 && y>=0 && x<=4 && y<=4 && board[x][y]==0){
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

function evaluate(){
    var numSheep = 0;
    var numMovableTiger = 0;
    for(var x=0; x<5; x++){
	for(var y=0; y<5; y++){
	    if(board[x][y] == TIGER){
		if(canMove(x,y)){
		    numMovableTiger += 1;
		}
	    }else if(board[x][y] == SHEEP){
		numSheep += 1;
	    }		
	}
    }
    console.log("numSheep:" + numSheep + " numMovableTiger:" + numMovableTiger);
    return numSheep - numMovableTiger;
}

function alphabeta(board, depth, alpha, beta){
    if(isTerminal() || depth == 0)
	return evaluate(depth);
    for(var numMoves = generateMoves(depth);numMoves>0; numMoves--){
		makeMove();
		alpha = Math.max(alpha, -alphabeta(board, depth-1, -beta, -alpha));
		if(beta <= alpha){break;}
			unMakeMove();
    }
    return alpha;
}

$(document).ready(function(){
    drawBoard();
    $('td').live('click',function(){
	x = parseInt($(this).attr('x'));
	y = parseInt($(this).attr('y'));
	if(isValidMove(x,y)){
	    console.log(x + " " + y + " " + numSheepsInBasket);
	    board[x][y] = SHEEP;
	    numSheepsInBasket -= 1;
	    tigersTurn = true;
	    moveTiger();
	}
	drawBoard();
    });
});
