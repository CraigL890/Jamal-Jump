//board
let board;
let boardWidth = 360;
let boardHeight = 700;
let context;

// sound 
let background_music = new Audio("Mii Plaza.mp3");

//JAMAL
let Jamalheight = 46;
let Jamalwidth = 46;
let jamalX = boardWidth/2 - Jamalwidth/2;
let jamalY = boardHeight*7/8 - Jamalheight;
let jamalImageLeft;
let jamalImageRight;


let jamal = {
  img : null,
  x : jamalX,
  y : jamalY,
  width : Jamalwidth,
  height : Jamalheight
}

// physics
let velocityX = 0;
let velocityY = 0;
let intialVelocityY = -6;
let gravity = 0.2;
 

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let MaxScore = 0;
let gameover = false;

window.onload = function() {
  background_music.loop = true;
  background_music.play();
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");



//loadimage
jamalImageRight = new Image();
jamalImageRight.src = "jamal (3).png"; // this is the image for jamal
jamal.img = jamalImageRight;
jamalImageRight.onload = function(){
    context.drawImage(jamal.img,jamal.x,jamal.y,jamal.width, jamal.height);
}

  platformImg = new Image();
  platformImg.src = "brics.jpg";
  velocityY = intialVelocityY;
  placePlatforms();
  jamalImageLeft = new Image();
  jamalImageLeft.src = "Jamal_left.png";

  requestAnimationFrame(update);
  document.addEventListener("keydown", moveJamal);
}


function update() {
    requestAnimationFrame(update);

    if (gameover){
      return;
    }
    context.clearRect(0,0, board.width, board.height);
    
    //jamal
    jamal.x += velocityX;
    if (jamal.x > boardWidth){
      jamal.x = 0;
    }

    else if (jamal.x + jamal.width < 0){
      jamal.x = boardWidth;       
    }

    velocityY += gravity;
    jamal.y += velocityY;
    if (jamal.y > board.height){
      gameover = true;
    }
    context.drawImage(jamal.img, jamal.x, jamal.y, Jamalwidth, Jamalheight);

    
    for (let i = 0; i < platformArray.length; i++) {
      let platform = platformArray[i];
      if (velocityY < 0 && jamal.y < boardHeight*3/4){
        platform.y -= intialVelocityY; // slide platform down
      }
      if (detectCollision(jamal, platform) &&  velocityY >= 0){
        velocityY = intialVelocityY;
      }
      context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }


    while (platformArray.length > 0 && platformArray[0].y >= boardHeight){
        platformArray.shift();
        newplatform();
    
    }
    
    //score this keeps it uptodate

    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5 , 20 );


    if (gameover){
      context.fillText("Game over: press *space* to Restart", boardWidth/7 , boardHeight*7/8);
    }
}
function moveJamal(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { // move right
        velocityX = 3;
        jamal.img = jamalImageRight;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -3;
        jamal.img = jamalImageLeft;
    }
    else if ( e.code == "Space" && gameover){
       jamal = {
        img : jamalImageRight,
        x : jamalX,
        y : jamalY,
        width : Jamalwidth,
        height : Jamalheight
      }
      velocityX = 0;
      velocityY = intialVelocityY;
      score = 0;
      MaxScore = 0;
      gameover = false; 
      placePlatforms();
    }
}
function placePlatforms() {
  platformArray = [];

  //starting platforms
  let platform = {
      img : platformImg,
      x : boardWidth/2,
      y : boardHeight - 0,
      width : platformWidth,
      height : platformHeight
  }

   platformArray.push(platform);

  
  for (let i = 0 ; i < 6 ; i++){
      let randomx = Math.floor(Math.random() * boardWidth *3/4 );
      let platform = {
        img : platformImg,
        x : randomx,
        y : boardHeight - 95*i - 100,
        width : platformWidth,
        height : platformHeight
    }
  
     platformArray.push(platform);
  }
}
function newplatform(){
    let randomx = Math.floor(Math.random() * boardWidth * 3/4);
    let platform = {
      img : platformImg,
      x : randomx,
      y : -platformHeight,
      width : platformWidth,
      height : platformHeight
  }

   platformArray.push(platform);
}



function detectCollision(a,b){
  return a.x < b.x + b.width &&    //a's top left corner doesn't reach b's top right corner
  a.x + a.width > b.x &&           //a's top right corner passes b's top left corner
  a.y < b.y + b.height &&          //a's top left corner doesn't reach b's bottom left corner
  a.y + a.height > b.y;            //a's bottom left corner passes b's top left corner
}

function updateScore(){
    let points = Math.floor(50*Math.random());
    if (velocityY < 0 ){
      MaxScore += points;
      if (score < MaxScore){
          score = MaxScore;
      }
    }
    else if (velocityY >= 0 ){
      MaxScore -= points;
    }
}