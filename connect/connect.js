
// player 0 = YELLOW
// player 1 = RED
var isSingle = 0;
var playerColor = ['yellow','red'];
var board = [[],[],[],[],[],[],[]];
var check = {
    'left':0,
    'right':0,
    'up':0,
    'down':0,
    'dul':0,
    'ddr':0,
    'dur':0,
    'ddl':0
} 
var startGame = false;
var directionArr = [
    { coladd:-1, rowadd: 0, name:'left'},
    { coladd:-1, rowadd: 1, name:'dul'},
    { coladd:0, rowadd: 1, name:'up'},
    { coladd:1, rowadd: 1, name:'dur'},
    { coladd:1, rowadd: 0, name:'right'},
    { coladd:1, rowadd: -1, name:'ddr'},
    { coladd:0, rowadd: -1, name:'down'},
    { coladd:-1, rowadd: -1, name:'ddl'},
]
var gameState = {
    turn:1,
    board:board
}
/* vars /\ func \/ ---------------------------------------------------------------------------------------------------*/
function buildInitialState() {
    for (let x = 0; x < 7; x++) {
        for(let y = 0;y < 6; y++){
            $('section').append($(`<div id='${x}-${y}' class='board'>`))
        }
    }
}
buildInitialState();

function checkForWin(x,y){
	console.log(gameState.turn)
	let positions = {...check}
	for (const dir in positions) {
		let dirObj = directionArr.filter((obj)=>{return obj.name === dir})[0]
		let curRowAdd = dirObj.rowadd + x;
		let curColAdd = dirObj.coladd + y;
		if(curColAdd <= 5 && curColAdd >= 0 && curRowAdd <= 6 && curRowAdd >= 0){
			let nextPiece = gameState.board[curRowAdd][curColAdd]
			while(nextPiece !== undefined){
				if(nextPiece === gameState.turn){
                    positions[dir] += 1;
                    try {
                        curRowAdd += dirObj.rowadd;
					    curColAdd += dirObj.coladd;
					    nextPiece = gameState.board[curRowAdd][curColAdd];
                    } catch (error) {
                        break;
                    }
				} else {
					break;
				}
			}
		}
	}
	console.log(positions)
	if(positions.ddl + positions.dur >= 3 || positions.ddr + positions.dul >= 3 || positions.left >= 3 || positions.up + positions.down >= 3){
        return true;
    } 
    return false;
}

function gameOver(player){
    alert(`${player} has won the game!`);
    reset();
}

function cpuTurn(){
    let moved = 0;
    let location;
    gameState.board.forEach((column,x)=>{
        if(checkForWin(x,gameState.board[x].length-1)){
            moved = 1;
            gameState.board[x].push(gameState.turn);
            location = x;
        }
    })
    if(!moved){
        location = Math.floor(Math.random()*6)
        gameState.board[location].push(gameState.turn);
    }
    
    if(checkForWin(location,gameState.board[location].length-1)){
        gameOver(playerColor[gameState.turn]);
    }
    gameState.turn = 1;
}

function renderState() {
    gameState.board.forEach((element,i) => {
        element.forEach((player,j)=>{
            if(player){
                $(`#${i}-${j}.board`).addClass('red')
            } else {
                $(`#${i}-${j}.board`).addClass('yellow')
            }
        });
    });
    $('#turn').text(`It's ${playerColor[gameState.turn]}'s turn`);
}

function onBoardClick() {
    let over = 0;
    if(startGame){
        const y = parseInt($(this).attr('id')[2]);
        console.log($(this).attr('id'));
        const x = parseInt($(this).attr('id')[0]);
        if(gameState.board[x].length < 6 && !isSingle){
            gameState.board[x].push(gameState.turn)
            if(checkForWin(x,gameState.board[x].length-1)){
                gameOver(playerColor[gameState.turn]);
            }
            if(gameState.turn){
                gameState.turn = 0; // changing the turns 
            } else {
                gameState.turn = 1;
            }
            renderState()
        } else {
            if (gameState.turn === isSingle){
                gameState.board[x].push(gameState.turn)
                if(checkForWin(x,gameState.board[x].length-1)){
                    gameOver(playerColor[gameState.turn]);
                    over = 1;
                }
                if(!over){
                    gameState.turn = 0;
                    cpuTurn()
                    renderState()
                }
            } 
        }
    } 
}
  
function reset(){
    $('#turn').css('display','none');
    console.log(gameState.board)
    gameState.board = [[],[],[],[],[],[],[]];
    $('.board').removeClass('red').removeClass('yellow')
    startGame = false;
    $('#startup').css('display','flex');
    $('#single').css('display','inline')
    $('#multi').css('display','inline')
    $('#multiMenu').css('display','none');
    isSingle = 0;
}

$('.board').on('click', onBoardClick);

$('#startGame').click(()=>{
    if(isSingle){
        playerColor[1] = $('#red').val() === '' ? 'red' :  $('#red').val();
        playerColor[0] = 'the Computer';
    } 
    if(!isSingle) {
        playerColor[0] = $('#yellow').val() === '' ? 'yellow' :  $('#yellow').val();
        playerColor[1] = $('#red').val() === '' ? 'red' :  $('#red').val();
    }
    console.log(playerColor)
    startGame = true;
    $('#startup').css('display','none');
    $('#turn').css('display','inline');
    $('#turn').text(`It's ${playerColor[gameState.turn]}'s turn`);
})

$('#single').click(()=>{
    $('#single').css('display','none')
    $('#multi').css('display','none')
    isSingle = 1;
    $('#multiMenu').css('display','flex');
    $('#singleMenu').css('display','none');

})

$('#multi').click(()=>{
    $('#single').css('display','none')
    $('#multi').css('display','none')
    isSingle = 0;
    $('#multiMenu').css('display','flex');
    $('#singleMenu').css('display','flex');
})
