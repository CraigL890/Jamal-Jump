//board
let board;
let boardWidth = 360;
let boardHeight = 700;
let context;


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
let intialVelocityY = -8 ;
let gravity = 0.4;
 

//platforms
let platforms = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let MaxScore = 0;
let gameover = false;

window.onload = function() {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw jamal
// context.fillStle = "green";
// context.fillRect(jamalX,jamalY,Jamalwidth,Jamalheight);

//loadimage
jamalImageRight = new Image();
jamalImageRight.src = "Jamal (3).png";
jamal.img = jamalImageRight;
jamalImageRight.onload = function(){
    context.drawImage(jamal.img,jamal.x,jamal.y,jamal.width, jamal.height);
}

  platformImg = new Image();
  platformImg.src = "Jamal_left.png";
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
    
    //score
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
        velocityX = 4;
        jamal.img = jamalImageRight;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
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
      y : boardHeight - 50,
      width : platformWidth,
      height : platformHeight
  }

   platformArray.push(platform);

   // platform = {
     // img : platformImg,
      //x : boardWidth/2,
      //y : boardHeight - 150,
      //width : platformWidth,
      //height : platformHeight
   //}
    //platformArray.push(platform);
  for (let i = 0 ; i < 6 ; i++){
      let randomx = Math.floor(Math.random() * boardWidth *3/4 );
      let platform = {
        img : platformImg,
        x : randomx,
        y : boardHeight - 75*i - 150,
        width : platformWidth,
        height : platformHeight
    }
  
     platformArray.push(platform);
  }
}
function newplatform(){
    let randomx = Math.floor(Math.random() * boardWidth *3/4 );
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
  return  a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.y < b.y + b.height &&
          a.y + a.height > b.y;
}

function updateScore(){
    let points = Math.floor(50*Math.random());
    if (velocityY < 0 ){
      MaxScore += points;
      if (score < MaxScore)
        {
          score = MaxScore;
      }
    }
    else if (velocityY >= 0 ){
      MaxScore -= points;
    }
}