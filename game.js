var version = '0.0.1';
var is_playing = false;
var in_level = false;
var level = 0;
var player;
var enemies;
var powerUp;
var speed = 5;
var bg_sprite = new Image();
var main_sprite = new Image();
var music;
var explosionSound;
var laserSound;

init();

function init() {
    background_canvas = document.getElementById('background_canvas');
    background_ctx = background_canvas.getContext('2d');
    main_canvas = document.getElementById('main_canvas');
    main_ctx = main_canvas.getContext('2d');
    player_canvas = document.getElementById('player_canvas');
    player_ctx = player_canvas.getContext('2d');
    enemy_canvas = document.getElementById('enemy_canvas');
    enemy_ctx = enemy_canvas.getContext('2d');

    document.addEventListener("keydown", key_down, false);
    document.addEventListener("keyup", key_up, false);

    requestaframe = (function () {
        return window.requestAnimationFrame         ||
            window.webkitRequestAnimationFrame      ||
            window.mozRequestAnimationFrame         ||
            window.oRequestAnimationFrame           ||
            window.msRequestAnimationFrame          ||
            function (callback) {
                window.setTimeout(callback, 1000/60)
            };

    })();
    player = new Player();
    powerUp = new PowerUp();
    enemies = new Array();
    bullets = new Array();
    friendlyBullets = new Array();

    load_media();
}

function load_media() {
    bg_sprite = new Image();
    bg_sprite.src = 'images/bg_sprite.jpg';
    main_sprite = new Image();
    main_sprite.src = 'images/main_sprite.png';
    music = new Audio("sounds/theme.mp3");
    explosionSound = new Audio("sounds/explosion.mp3");
    laserSound = new Audio("sounds/laser.mp3");
}

function mouse(e) {
    var x = e.pageX - document.getElementById('game_object').offsetLeft;
    var y = e.pageY - document.getElementById('game_object').offsetTop;
}

var r_y = 0;
var r_x = 0;

function Player() {
    this.drawX = 50;
    this.drawY = 300;
    this.bg_X = -400;
    this.bg_Y = -400;
    this.srcY = 221;
    this.srcX = 62;
    this.width = 21;
    this.heigth = 23;
    this.speed = 6;
    this.is_downkey = false;
    this.is_upkey = false;
    this.is_leftkey = false;
    this.is_rightkey = false;
    this.is_spacekey = false;
    this.exploded = false;
    this.powerUp = 0;
}

Player.prototype.draw = function(){
    this.check_keys();
    player_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);

    if (this.exploded == true) {
        stop_loop();
        player_ctx.clearRect(0,0,800, 600);
    }

    if (this.exploded == true) {
        explode1(this.drawX, this.drawY);
    }
}

function explode1(x, y) {
    enemy_ctx.drawImage(main_sprite, 8, 137, 15, 13, x, y, 15, 13);
    playExplosion();
    setTimeout(function(){explode2(x,y)}, 100);
}

function explode2(x, y) {
    enemy_ctx.drawImage(main_sprite, 37, 134, 21, 20, x, y, 21, 20);
    setTimeout(function(){explode3(x, y)}, 200);
}

function explode3(x, y) {
    enemy_ctx.drawImage(main_sprite, 66, 131, 26, 27, x, y, 26, 27);
    setTimeout(function(){explode4(x, y)}, 300);
}

function explode4(x, y) {
    enemy_ctx.drawImage(main_sprite, 98, 129, 28, 29, x, y, 28, 29);
    setTimeout(function(){explode5(x, y)}, 400);
}

function explode5(x, y) {
    setTimeout(clearExplosion, 400);
    enemy_ctx.drawImage(main_sprite, 128, 129, 31, 30, x, y, 31, 30);
    setTimeout(function(){explode6(x, y)}, 500);
}

function explode6(x, y) {
    setTimeout(clearExplosion, 500);
    enemy_ctx.drawImage(main_sprite, 160, 128, 32, 32, x, y, 32, 32)
    setTimeout(function(){explode7(x, y)}, 600);
}

function explode7(x, y) {
    setTimeout(clearExplosion, 600);
    enemy_ctx.drawImage(main_sprite, 192, 128, 32, 32, x, y, 32, 32);
    setTimeout(function(){explode8(x, y)}, 700);
}

function explode8(x, y) {
    setTimeout(clearExplosion, 700);
    enemy_ctx.drawImage(main_sprite, 225, 129, 31, 31, x, y, 31, 31);
}

function clearExplosion() {
    enemy_ctx.clearRect(0,0,800,600);
}

Player.prototype.check_keys = function (){
    if(this.is_downkey == true && this.drawY <= 550){
        this.drawY+=this.speed;
        if (this.bg_Y < 0) {
            this.bg_Y += speed/2;
        }
    };

    if(this.is_upkey == true && this.drawY >= 20){
        this.drawY-=this.speed;
        if (this.bg_Y > -1820) {
            this.bg_Y -= speed/2;
        }
    };

    if(this.is_rightkey == true && this.drawX <= 750){
        this.drawX+=this.speed;
        if (this.bg_X < 0) {
            this.bg_X += speed/2;
        }
    };

    if(this.is_leftkey == true && this.drawX >= 20){
        this.drawX-=this.speed;
        if (this.bg_X > -1214) {
            this.bg_X -= speed/2;
        }
    };

    if(this.is_spacekey == true){
        friendlyBullets[friendlyBullets.length] = new FriendlyBullet(this.drawX+this.width, this.drawY+this.heigth/2, 0);
        if (this.powerUp > 0) {
            friendlyBullets[friendlyBullets.length] = new FriendlyBullet(this.drawX+this.width, this.drawY+this.heigth/2, 3);
            friendlyBullets[friendlyBullets.length] = new FriendlyBullet(this.drawX+this.width, this.drawY+this.heigth/2, -3);
        }
    };

}

function Enemy(y, x) {
    this.drawX = x;
    this.drawY = y;
    this.srcY = 176;
    this.srcX = 15;
    this.width = 19;
    this.heigth = 16;
    this.speed = 1;
    this.exploded = false;
    this.firstIteration = true;
    this.hitType = 0;
}

Enemy.prototype.draw = function(){
    this.ai();
    if (this.exploded == false) {
        main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);

    }

    if (this.exploded == true && this.firstIteration == false) {
        this.drawY = -3000;
        this.drawX = -3000;
        this.heigth = 0;
        this.width = 0;
    }

    if ((this.drawX <= player.drawX + player.width && this.drawX >= player.drawX || this.drawX+this.width*2 <= player.drawX + player.width && this.drawX+this.width*2 >= player.drawX)
        && (this.drawY <= player.drawY + player.heigth && this.drawY >= player.drawY || this.drawY+this.heigth*2 <= player.drawY + player.heigth && this.drawY+this.heigth*2 >= player.drawY)) {
        this.exploded = true;
        this.hitType = 1;
    }

    if (this.exploded == true && this.firstIteration == true) {

        explode1(this.drawX, this.drawY);

        this.firstIteration = false;

        if (this.hitType == 1) {
            player.exploded = true;
        }
    }
}

Enemy.prototype.ai = function () {
    this.drawX -= this.speed;
    if (Math.floor(Math.random()*50) == 25 && this.exploded == false) {
        bullets[bullets.length] = new Bullet(this.drawX-(this.width/2), this.drawY+(this.heigth/2));
    }
}

function PowerUp(y, x) {
    this.drawX = x;
    this.drawY = y;
    this.srcY = 434;
    this.srcX = 192;
    this.width = 10;
    this.heigth = 10;
    this.speed = 2;
    this.gotted = false;
}

PowerUp.prototype.draw = function(){
    if (this.gotted == false) {
        main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width*2, this.heigth*2);
    }

    this.drawX-=this.speed;

    if ((this.drawX <= player.drawX + player.width && this.drawX >= player.drawX || this.drawX+this.width*2 <= player.drawX + player.width && this.drawX+this.width*2 >= player.drawX)
        && (this.drawY <= player.drawY + player.heigth && this.drawY >= player.drawY || this.drawY+this.heigth*2 <= player.drawY + player.heigth && this.drawY+this.heigth*2 >= player.drawY)) {
        this.gotted = true;
    }

    if (this.gotted == true) {
        player.powerUp++;

        this.drawY = -3000;
        this.drawX = -3000;
        this.heigth = 0;
        this.width = 0;
    }
}

function Bullet(x, y) {
    this.drawX = x;
    this.drawY = y;
    this.srcX = 208;
    this.srcY = 119;
    this.width = 11;
    this.heigth = 3;
    this.speed = 6;
    this.exploded = false;
    this.firstIteration = true;
    playLaser();

}
Bullet.prototype.draw = function() {
    if (this.exploded == false) {
        main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);
    }
    this.drawX -= this.speed;

    if ((this.drawX <= player.drawX + player.width && this.drawX >= player.drawX || this.drawX+this.width*2 <= player.drawX + player.width && this.drawX+this.width*2 >= player.drawX)
        && (this.drawY <= player.drawY + player.heigth && this.drawY >= player.drawY || this.drawY+this.heigth*2 <= player.drawY + player.heigth && this.drawY+this.heigth*2 >= player.drawY)) {
        this.exploded = true;
    }

    if (this.exploded == true && this.firstIteration == true) {

        this.firstIteration = false;

        player.exploded = true;
    }
}

//Quelle: https://stackoverflow.com/questions/6893080/html5-audio-play-sound-repeatedly-on-click-regardless-if-previous-iteration-h
function playLaser() {
    var laserShot = laserSound.cloneNode();
    laserShot.volume=0.3;
    laserShot.play();
}

function playExplosion() {
    var explosion = explosionSound.cloneNode();
    explosion.volume=1;
    explosion.play();
}

function FriendlyBullet(x, y, speedY) {
    this.drawX = x;
    this.drawY = y;
    this.srcX = 179;
    this.srcY = 87;
    this.width = 10;
    this.heigth = 3;
    this.speed = 6;
    this.exploded = false;
    this.firstIteration = true;
    this.speedY = speedY;

    playLaser();

}
FriendlyBullet.prototype.draw = function() {
    if (this.exploded == false) {
        main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);
    }
    if (this.drawY >= 600 || this.drawY <= 0) {this.speedY*=-1;};

    this.drawX += this.speed;
    this.drawY += this.speedY;

    for (var i = 0; i < enemies.length; i++) {
        if ((this.drawX <= enemies[i].drawX + enemies[i].width && this.drawX >= enemies[i].drawX || this.drawX+this.width*2 <= enemies[i].drawX + enemies[i].width && this.drawX+this.width*2 >= enemies[i].drawX)
            && (this.drawY <= enemies[i].drawY + enemies[i].heigth && this.drawY >= enemies[i].drawY || this.drawY+this.heigth*2 <= enemies[i].drawY + enemies[i].heigth && this.drawY+this.heigth*2 >= enemies[i].drawY)) {
            this.exploded = true;
            playExplosion();
        }

        if (this.exploded == true && this.firstIteration == true) {
            enemies[i].exploded = true;
            this.firstIteration = false;
        }
    }


}

function spawn_enemy(n) {
    var y_position = 600/(n+1);
    for (var i = 0; i < n; i++){
        enemies[enemies.length] = new Enemy(y_position*(i+1), Math.floor(Math.random()*100)+830);
    }
}

function loop(){
    main_ctx.clearRect(0,0,800,600);
    player_ctx.clearRect(0,0,800,600);
    player.draw();
    powerUp.draw();

    for (var i = 0; i < enemies.length; i++){
        enemies[i].draw();
    }
    for (var i = 0; i < bullets.length; i++){
        bullets[i].draw();
    }

    for (var i = 0; i < friendlyBullets.length; i++){
        friendlyBullets[i].draw();
    }

    //Source: https://www.geeksforgeeks.org/html5-game-development-infinitely-scrolling-background/
    background_ctx.drawImage(bg_sprite, player.bg_X, player.bg_Y);
    background_ctx.drawImage(bg_sprite, player.bg_X+800, player.bg_Y);

    player.bg_X -= 3;

    if (player.bg_X < -800) player.bg_X = 0;

    if (is_playing)
        requestaframe(loop);
}

function enemy_loop() {
    spawn_enemy(Math.floor(Math.random()*6)+1);
    if(is_playing) // change to enemy variable
        setTimeout(enemy_loop, 5000);
}

function spawn_powerUp() {
    powerUp = new PowerUp(Math.floor(Math.random()*550)+25, 830);
}

function powerUp_loop() {
    spawn_powerUp();
    if(is_playing)
        setTimeout(powerUp_loop, Math.floor(Math.random()*20000)+20000);
}

function start_loop() {
    is_playing = true;
    music.play();
    setTimeout(powerUp_loop, Math.floor(Math.random()*20000)+20000);
    loop();
    enemy_loop();

}

function stop_loop(){
    music.pause();
    is_playing = false;
}

function key_down(e) {
    var key_id = e.keyCode || e.which;
    if (key_id == 40){ // down key
        player.is_downkey = true;
        e.preventDefault();
    }
    if (key_id == 38){ // up key
        player.is_upkey = true;
        e.preventDefault();
    }
    if (key_id == 37){ // left key
        player.is_leftkey = true;
        e.preventDefault();
    }
    if (key_id == 39){ // right key
        player.is_rightkey = true;
        e.preventDefault();
    }
    if (key_id == 32){ // space bar
        player.is_spacekey = true;
        e.preventDefault();
    }
}

function key_up(e) {
    var key_id = e.keyCode || e.which;
    if (key_id == 40){ // down key
        player.is_downkey = false;
        e.preventDefault();
    }
    if (key_id == 38){ // up key
        player.is_upkey = false;
        e.preventDefault();
    }
    if (key_id == 37){ // left key
        player.is_leftkey = false;
        e.preventDefault();
    }
    if (key_id == 39){ // right key
        player.is_rightkey = false;
        e.preventDefault();
    }
    if (key_id == 32){ // space bar
        player.is_spacekey = false;
        e.preventDefault();
    }
}