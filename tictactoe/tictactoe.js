var players = ['X', 'O'];
var playerName = ['X', 'O'];
var isSingle = false;
var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]
const gameState = {
    playerName : [...playerName],
    players: [...players],
    board: [
    [null, null, null],
    [null, null, null],
    [null, null, null]
    ],
    turn:0
}
var gameStarted = false;


function createBoard(){
    for(let y = 0; y < 3;y++){
        for(let x = 0; x < 3;x++){
            $('#board').append(
                $(`<div id='${x}-${y}' class='cell'>`)
            )
        }
    }
}
createBoard()

function deeperCopy(array) {
	let x = [...array]
	array.forEach((element,i)=>{
		if(typeof( element ) === 'object'){
			x[i] = [...element];
		} else {
			x[i] = element;
		}
	})
	return x;
}

function isWin(y,x){
    const testBoard = deeperCopy(gameState.board);
    testBoard[y][x] = players[gameState.turn]
    for(let i = 0;i < 3; i++){ //left to right
        if(testBoard[i].join('-') === `${players[gameState.turn]}-${players[gameState.turn]}-${players[gameState.turn]}`){
            return true;
        }
    }
    
    let vert;
    for(let i = 0; i < 3; i++){ //top to bottom
        vert = []
        for (let j = 0; j < 3; j++) {
            vert.push(testBoard[j][i])
        }
        if(vert.join('-') === `${players[gameState.turn]}-${players[gameState.turn]}-${players[gameState.turn]}`){
            return true;
        }
    }

    //the rest of this function is gross   
    let diagonal; //diagonals
    diagonal = [];
    diagonal.push(testBoard[0][0]) 
    diagonal.push(testBoard[1][1])
    diagonal.push(testBoard[2][2])
    if(diagonal.join('-') === `${players[gameState.turn]}-${players[gameState.turn]}-${players[gameState.turn]}`){
        return true;
    }
    diagonal = [];
    diagonal.push(testBoard[2][0])
    diagonal.push(testBoard[1][1])
    diagonal.push(testBoard[0][2])
    if(diagonal.join('-') === `${players[gameState.turn]}-${players[gameState.turn]}-${players[gameState.turn]}`){
        return true;
    }
}

function gameOver(){
    alert(`${playerName[gameState.turn]} has won!`)
    reset()
}

function reset(){
    $('.cell').text(null)
    gameState.board = [[null, null, null],
    [null, null, null],
    [null, null, null]]
    gameState.playerName = [...playerName]
    gameState.turn = 0;
    $('#turn').text(null)
    gameStarted = false;
    $('#overlay').css('display','flex');
    $('#single').css('display','inline')
    $('#multi').css('display','inline')
    $('#multiMenu').css('display','none');
    isSingle = false;
}

$('#single').click(()=>{
    $('#single').css('display','none')
    $('#multi').css('display','none')
    isSingle = true;
    $('#multiMenu').css('display','flex');
    $('#singleMenu').css('display','none');

});

$('#multi').click(()=>{
    isSingle = false;
    $('#single').css('display','none')
    $('#multi').css('display','none')
    
    $('#multiMenu').css('display','flex');
    $('#singleMenu').css('display','flex');
})

$('#startGame').click(()=>{
    if(isSingle){
        gameState.playerName[0] = $('#X').val() === '' ? 'X' :  $('#X').val();
        gameState.playerName[1] = 'the Computer';
    } 
    if(!isSingle) {
        gameState.playerName[0] = $('#X').val() === '' ? 'X' :  $('#X').val();
        gameState.playerName[1] = $('#O').val() === '' ? 'O' :  $('#O').val();
    }
    gameStarted = true;
    $('#overlay').css('display','none');
    $('#turn').css('display','flex');
    $('#turn').text(`It's ${playerName[gameState.turn]}'s turn`);
})

$('#new').click(reset)

$('.cell').click(function(){
    const x = $(this).attr('id')[2]
    const y = $(this).attr('id')[0]
    if(gameState.board[y][x] === null && gameStarted){
        gameState.board[y][x] = players[gameState.turn];
        $(`#${y}-${x}`).text(`${players[gameState.turn]}`)
        if(isWin(y,x)){
            gameOver();
        } else {
            if( gameState.board.reduce((acc,row)=>{row.forEach((element)=>{if(element === null) acc++});return acc;},0) === 0) { // returns true if no null values are in the gameState.board and a win has not occured :)
                alert("cat's game");
                reset();
            }
            if(isSingle){
                gameState.turn = 1;
                computerTurn()
                gameState.turn = 0;
            } else {
                gameState.turn = gameState.turn === 0 ? 1 : 0;
            }
            $('#turn').text(`It's ${gameState.playerName[gameState.turn]}'s turn`)
        }
    }
})

function computerTurn(){
    for (let i = 0; i < 3; i++) {
        for(let j = 0; j < 3;j++){
            if(isWin(i,j)){
                gameOver();
                return 0;
            }
        }
    }
    let x = Math.floor(Math.random()*2);
    let y = Math.floor(Math.random()*2);
    while(gameState.board[y][x]!==null){
        x = Math.floor(Math.random()*2);
        y = Math.floor(Math.random()*2);
    }
    gameState.board[y][x] = players[gameState.turn];
    $(`#${y}-${x}`).text(`${players[gameState.turn]}`)
}
