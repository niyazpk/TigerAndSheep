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
    [TIGER, 0, TIGER, 0, 0],
    [0, TIGER, 0, 0, 0],
    [TIGER, 0, 0, 0, TIGER]
];

function drawBoard(){
    var html= "<table>";
    for(x in board){
	html += "<tr>";
	for(y in board[x]){
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
    evaluate();
    var alpha = -INFINITY;
    var beta = INFINITY;
    //alphabeta(board, DEPTH, alpha, beta);
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
	)
    }
    return directions;
}

function tigerCanMoveTo(){
	
}

function generateMoves(){
    if(isTigersMove()){
	for(var x=0; x<5; x++){
	    for(var y=0; y<5; y++){
		//x = parseInt(x);
		//y = parseInt(y);
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
    for(x in board){
	for(y in board[x]){
	    x = parseInt(x);
	    y = parseInt(y);
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

function isTerminal(){
    if (areAllTigersBlocked() || tooManySheepsAreKilled()){
	return true;
    }else{
	return false;
    }
}

function canMove(x,y){
    // Is horizontal or vertical movement possible?
    
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
