//board
let board;
let boardwidth=500;
let boardheight=500;      //here board gets methods height and width 
let context;              //similarly context gets a lot of methods

//player
let playerheight=50;        //dimension of the player 
let playerwidth=10;        //the object gives position  
let playervelocityY=0;


//player1
let player1={   //not creating a property, only defining properties
    x : 10,                  //initial position of player
    y : boardheight/2,        //position
    width : playerwidth,     //dimension of the player
    height : playerheight,
    velocityY:playervelocityY   //velocity is ambition, y is reality
}

//player 2
let player2={
    x:boardwidth-20,
    y:boardheight/2,
    width:playerwidth,
    height:playerheight,
    velocityY:playervelocityY
}

//ball
let ballheight=10;
let ballwidth=10;
let ball={
    x:boardwidth/2,
    y:boardheight/2,
    width:ballwidth,
    height:ballheight,
    velocityX:1,
    velocityY:2
}
let player1Score=0;
let player2Score=0;
// ball will only appear once you start the game(it is not in the onload body)
window.onload=function() {        //que:why do you want the board to only come after loading?
    board=document.getElementById("board");
    board.height=boardheight;               //the board's dimensions will be required later for 
    board.width=boardwidth;                    //defining the player
    context=board.getContext("2d");   //que:can we only create the canvas and its elements in js why not in html?
    
    //draw initial player1  //emphasis on DRAW
    context.fillStyle="skyblue";         //que:context,fillstyle
    context.fillRect(player1.x,player1.y, player1.width, player1.height);

    //draw initial player2
    context.fillStyle="skyblue";
    context.fillRect(player2.x,player2.y,player2.width,player2.height);

    //create a game loop 
    requestAnimationFrame(update); //they only execute once
    document.addEventListener("keyup",movePlayer); //key up checks if a key is pressed

}          
function update(){          
    requestAnimationFrame(update);          //how does the format of the game loop look like
    context.clearRect(0,0,boardwidth,boardheight); //clear and fill both have same arguments
    //we're clearing because it will be repainted with new coordinates in the next iteration

    //player 1
    
    //player1.y+=player1.velocityY;    // this would make the paddle go beyond the board because we've assigned beyond extremes as the function
                                        //function was not checked
    nextPLayer1Y=player1.y+player1.velocityY;
    if (!outOfBounds(nextPLayer1Y))  //updation must come before drawing the rectangle i.e everything is defined before drawing the rectangle
    {   
        player1.y=nextPLayer1Y;
    }
    context.fillstyle="skyblue";
    context.fillRect(player1.x,player1.y, player1.width, player1.height);
    
    
    //player 2
    
    nextPLayer2Y=player2.y+player2.velocityY;
    if (!outOfBounds(nextPLayer2Y))
    {
        player2.y=nextPLayer2Y;
    }
    context.fillStyle="skyblue";
    context.fillRect(player2.x,player2.y,player2.width,player2.height);

    //ball
    context.fillStyle="white";
    ball.x+=ball.velocityX;
    ball.y+=ball.velocityY;//first adding the velocity then reverse
    if (ball.y<=0 || ball.y + ballheight>=boardheight){
        ball.velocityY*=-1;//reverse direction
    }
    context.fillRect(ball.x,ball.y,ball.width,ball.height);
    context.fillStyle="skyblue"; /* the latest color is added to the next created items. By the process of the loop, the next object
                                     will be player 1 and it will be assigned white color(player 1 is on the left)
                                     it is not there in the youtube tutorial*/
    if (detectCollision(player1,ball)){
        if (ball.x<=player1.x+player1.width){
            ball.velocityX*=-1; // flip x direction 
        }
    }
    else if (detectCollision(ball,player2)){  //detectCollision(player2,ball) also works
        if (ball.x+ball.width>=player2.x){ // because i did not place the containing braces, my board width hanged
                                                //biggest takeaway: if dimensions of your canvas changes, it is because of the braces
            ball.velocityX*=-1; }//flip x direction
    }
    //game over
    if (ball.x<=0){
        player2Score++;
        resetGame(1);
    }
    else if (ball.x+ball.width>=boardwidth){
        player1Score++;
        resetGame(-1);  
    }

    //score
    context.font="45px  sans-serif";
    context.fillText(player1Score,boardwidth/5,45);
    context.fillText(player2Score,boardwidth*4/5-45,45)

    //dotted line in the center
    for (let i=10;i<boardheight;i+=30){
        context.fillRect(boardwidth/2-10,i,5,5);
    }
 }   

//y posi is top ledt, player height to get bottom left point which is required when the player is going down
//because when the player goes down, we're checking if its bottom is exceeding


function outOfBounds(yPosition){
    return (yPosition<0||yPosition + playerheight >boardheight);  //boolean values instead of if else

}
function movePlayer(e){
    //player1
    if (e.code=="KeyW"){
        player1.velocityY=-3;
    }
    else if(e.code=="KeyS"){
        player1.velocityY=3;
    }

    //player2
    if (e.code=="ArrowUp"){
        player2.velocityY=-3;
    }
    else if(e.code=="ArrowDown"){
        player2.velocityY=3;
    }
}
//explained by 26:00
function detectCollision(a,b){
    return  a.x < b.x + b.width && //a's top left corner has not reached b's right corner
            a.x + a.width > b.x &&//a's top right corner passes  b's  top left corner
            a.y < b.y + b.height && //a's top left does not reach b's bottom left corner
            a.y + a.height > b.y ; //a's bottom left corner passes b's top left corner
}

function resetGame(direction){
    ball={
        x:boardwidth/2,
        y:boardheight/2,
        width:ballwidth,
        height:ballheight,
        velocityX:direction,
        velocityY:2
    }
}
