var snake = {
    body: [ [10, 5], [10, 6], [10, 7], [10, 8] ],
    nextDirection: 4,
}
var gameStarted = 0;
var highScore = 0;
var currentScore = 0;
var gameState = {
    apple: [11, 8],
    snake: snake // from above
}

let initialState;

function buildInitialState() {
    for(let y = 0; y < 15;y++){
        for(let x = 0;x<15;x++){
            $('section').append($(`<div class="cell" id = "${x}-${y}" draggable="false"></div>`))
        }
    }
    
}
buildInitialState();

function renderState() {
    $('.cell').removeClass('occupied');
    gameState.snake.body.forEach((cord)=>{
        $(`#${cord[0]}-${cord[1]}.cell`).addClass('occupied');
    })
    $('.cell').removeClass('apple');
    $(`#${gameState.apple[0]}-${gameState.apple[1]}.cell`).addClass('apple');
    $('#currentScore').text(`current score ${currentScore}`);
    $('#highScore').text(`highscore: ${highScore}`);
}

function slither(){
    if(gameStarted){
    const dir = gameState.snake.nextDirection;
    const headX = gameState.snake.body[gameState.snake.body.length - 1][0];
    const headY = gameState.snake.body[gameState.snake.body.length - 1][1];
    switch(dir){
        case 1 :  //right
        gameState.snake.body.push([headX+1,headY])                                     
        break;
        case 2 : //up
        gameState.snake.body.push([headX,headY-1])                                                     
        break;
        case 3 : //down
        gameState.snake.body.push([headX,headY+1])
        break;
        case 4: //left
        gameState.snake.body.push([headX-1,headY])
        break;
        default:console.log('somethings wrong');
    }
    const apple = `${gameState.apple[0]}-${gameState.apple[1]}`;
    const head = `${headX}-${headY}`;
    if(head === apple){
        let freeSpace = false;
        while (!freeSpace){
            const aX = Math.floor(Math.random()*14)
            const aY = Math.floor(Math.random()*14)
            if(!$(`#${aX}-${aY}.cell`).hasClass('occupied')){
                gameState.apple[0] = aX
                gameState.apple[1] = aY
                freeSpace = true;
            }
        }
        currentScore++;
        if(currentScore>highScore){
            highScore = currentScore;
        }
        $('.cell.apple').removeClass('apple')
    } else {
        gameState.snake.body.shift();
    }
    console.log(gameState.snake)
    console.log(gameState.snake.nextDirection)
}
}

setInterval(slither,100);
function restart(){
    gameState.snake.body = [ [10, 5], [10, 6], [10, 7], [10, 8] ];
    gameState.snake.nextDirection = 4;
    gameState.apple = [11, 8];
    currentScore = 0;
}

function selfDetection(){
    const headX = gameState.snake.body[gameState.snake.body.length - 1][0];
    const headY = gameState.snake.body[gameState.snake.body.length - 1][1];
    const head = `${headX}-${headY}`;
    gameState.snake.body.forEach((pos,index)=>{
        const part = `${pos[0]}-${pos[1]}`;
        if(index < gameState.snake.body.length-1){
            if(part === head) {
                restart();
            }
        }
    })
    if(headX > 14 || headX < 0 || headY > 14 || headY < 0){
        restart();
    }
}

function tick() {
    if(gameStarted){
    renderState()
    selfDetection()
    }
}
function startGame(){
    gameStarted = 1;
    $('#start').css('display','none')
}
$('#start').click(startGame);
setInterval(tick, 1000 / 30); 
  
// now you might have things like
$(window).on('keydown', function (event) {
    let key = event.key;
    console.log(key)
    switch(key){
        case 'ArrowDown': 
        if (gameState.snake.nextDirection !== 2) gameState.snake.nextDirection = 3;
        break;
        case 'ArrowUp': 
        if (gameState.snake.nextDirection !== 3) gameState.snake.nextDirection = 2;
        break;
        case 'ArrowLeft': 
        if (gameState.snake.nextDirection !== 1) gameState.snake.nextDirection = 4;
        break;
        case 'ArrowRight': 
        if (gameState.snake.nextDirection !== 4) gameState.snake.nextDirection = 1;
        break;
    }
})
