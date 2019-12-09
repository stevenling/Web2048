var board = new Array();
var score = 0;
$(document).ready(function(){
    newgame();
});
function newgame(){
    //初始化棋盘格
    init();
    generateOneNumber();//在棋盘中产生数字
    generateOneNumber();
}
function init() {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    for (var i = 0; i < 4; i++)
    {
        board[i] = new Array();
        for(var j = 0; j < 4; j++)
            board[i][j] = 0;
    }
    updateBoardView();
    score = 0;
    updateScore(score);
}
function updateBoardView() {
    $(".number-cell").remove();//之前存在就清除
    for(var i = 0; i < 4; i++) {
        for(var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class = "number-cell" id = "number-cell-' + i + '-' + j+'"></div>')
            var theNumberCell =  $('#number-cell-' + i + '-' + j);
            if(board[i][j] == 0)//不显示
            {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top',getPosTop(i,j)+50);
                theNumberCell.css('left',getPosLeft(i,j)+50);
            }
            else{
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color',getNumberColor(board[i][j]));
                theNumberCell.text (board[i][j]);
            }
        }

    }
}
function generateOneNumber(){//随机生成数字
    //棋盘中还有空间就生成数字
    if(nospace(board)) // 没有空间返回true
    {
        return false;
    }
    //随机位置

    var randx = parseInt(Math.floor(Math.random()*4));//随机生成0-4的位置不包括4
    var randy = parseInt(Math.floor(Math.random()*4));
    //判断位置是否可用
    while(true)
    {
        if(board[randx][randy] == 0)
        {
            break;//位置可用跳出死循环，不可用继续找
        }
        randx = parseInt(Math.floor(Math.random()*4));//随机生成0-4的位置不包括4
        randy = parseInt(Math.floor(Math.random()*4));
    }
   // window.alert(board[randx][randy]);
    //随机数字
    var randNumber = Math.random() > 0.5? 2: 4;//生成2或4概率相同
    //在随机位置显示随机数字
    board[randx][randy] = randNumber;//坐标值改变
    showNumberWithAnimation(randx, randy, randNumber);//用一个函数显示动画效果


    return true;
}
//按键效果
$(document).keydown(function (event) {
        switch( event.keyCode ){
            case 37://left
                if(moveLeft()){
                    setTimeout("generateOneNumber()",160);
                    setTimeout("isgameover()",300);
                }
                break;
            case 38://top
                if(moveTop()){
                    setTimeout("generateOneNumber()",160);
                    setTimeout("isgameover()",300);
                }
                break;
            case 39://right
                if(moveRight()){
                    setTimeout("generateOneNumber()",160);
                    setTimeout("isgameover()",300);
                }
                break;
            case 40://bottom
                if(moveDown()){
                    setTimeout("generateOneNumber()",160);
                    setTimeout("isgameover()",300);
                }
                break;
            default:
                break;
        }
    });

function isgameover()//判断游戏是否结束
{
    if(nospace(board) && nomove(board))
        gameover();
}
function gameover()
{
    alert("game over!");
}
function nomove(board)
{
    if(canMoveDown(board) || canMoveLeft(board) || canMoveRight(board) || canMoveTop(board))
        return false;
    return true;
}
function moveLeft(){
    if(!canMoveLeft(board))//如果不能移动
        return false;
    for(var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if(board[i][j] != 0)
            {
                for(var k = 0; k < j; k++)
                {
                    if(board[i][k] == 0 && noBlockHor(i, k, j, board))//左侧为空
                    {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHor(i, k, j, board))
                    {
                        //move
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = 2*board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        score += board[i][k];
                        updateScore(score);
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",150);

    return true;
}
function moveTop(){
    if(!canMoveTop(board))//如果不能移动
        return false;

    for(var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if(board[i][j] != 0)
            {
                for(var k = 0; k < i; k++)
                {
                    if(board[k][j] == 0 && noBlockVer(j, k, i, board))//上侧为空
                    {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockVer(j, k, i, board))
                    {
                        //move
                        //add
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = 2*board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        score += board[k][j];
                        updateScore(score);

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",150);

    return true;
}

function moveRight(){
    if(!canMoveRight(board))//如果不能移动
        return false;

    for(var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            if(board[i][j] != 0)
            {
                for(var k = j+1; k < 4; k++)
                {
                    if(board[i][k] == 0 && noBlockHor(i, j, k, board))//上侧为空
                    {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        continue;
                    }
                    else if(board[i][k] == board[i][j] && noBlockHor(i, j, k, board))
                    {
                        //move
                        //add
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = 2*board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        score += board[i][k];
                        updateScore(score);

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",150);

    return true;
}

function moveDown(){
    if(!canMoveDown(board))//如果不能移动
        return false;

    for(var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if(board[i][j] != 0)
            {
                for(var k = i+1; k < 4; k++)
                {
                    if(board[k][j] == 0 && noBlockVer(j, i, k, board))//下侧为空
                    {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        continue;
                    }
                    else if(board[k][j] == board[i][j] && noBlockVer(j, i, k, board))
                    {
                        //move
                        //add
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = 2*board[i][j];//移动过去
                        board[i][j] = 0;//之前的消失
                        score += board[k][j];
                        updateScore(score);

                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",150);

    return true;
}