// constants
var TIGER = 1;
var SHEEP = 2;

var tigerTurn = false;
var numSheepInBasket = 20;

var board = [
				[1, 0, 0, 0, 1],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0],
				[1, 0, 0, 0, 1]
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
	if(numSheepInBasket > 0){
		if(board[x][y] != 0){
			return false;
		}
	}
	return true;
}

function moveTiger(){
	console.log(evaluate());
}

function generateMoves(){

}

function makeMove(){

}

function unMakeMove(){

}

function isUnOccupied(x,y){
	if(x>=0 && y>=0 && x<=4 && y<=4 && board[x][y]==0){
		return true;
	}else{
		return false;
	}
}

function canMove(x,y){
	// Is horizontal or vertical movement possible?
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
	 
	 // Tiger is blocked
	 return false;
}

function evaluate(){
	var numSheep = 0;
	var numMovableTiger = 0;
	for(x in board){
		for(y in board[x]){
			x = parseInt(x);
			y = parseInt(y);
			if(board[x][y] == 1){
				if(canMove(x,y)){
					numMovableTiger += 1;
				}
			}else if(board[x][y] == 2){
				numSheep += 1;
			}		
		}
	}
	console.log("numSheep:" + numSheep + " numMovableTiger:" + numMovableTiger)
	return numSheep - numMovableTiger;
}

$(document).ready(function(){
	drawBoard();
	$('td').live('click',function(){
		x = $(this).attr('x');
		y = $(this).attr('y')
		if(isValidMove(x,y)){
			//console.log(x + " " + y + " " + numSheepInBasket);
			board[x][y] = 2;
			numSheepInBasket -= 1;
			tigerTurn = true;
			moveTiger();
		}
		drawBoard();
	});
});
