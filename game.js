var version = '0.0.1';
var is_playing = false;
var player;
var enemies;
var speed = 5;
var bg_sprite = new Image();
var main_sprite = new Image();

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
    this.powerUp = 1;
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

    if (this.drawX <= player.drawX + player.width && this.drawX >= player.drawX
        && this.drawY <= player.drawY + player.heigth && this.drawY >= player.drawY) {
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
        bullets[bullets.length] = new Bullet(this.drawX, this.drawY);
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

}
Bullet.prototype.draw = function() {
    if (this.exploded == false) {
        main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);
    }
    this.drawX -= this.speed;

    if (this.drawX <= player.drawX + player.width && this.drawX >= player.drawX
        && this.drawY <= player.drawY + player.heigth && this.drawY >= player.drawY) {
        this.exploded = true;
    }

    if (this.exploded == true && this.firstIteration == true) {

        this.firstIteration = false;

        player.exploded = true;
    }
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
    this.speedY = speedY

}
FriendlyBullet.prototype.draw = function() {
    if (this.exploded == false) {
        main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);
    }
    if (this.drawY >= 600 || this.drawY <= 0) {this.speedY = this.speedY*-1;};

    this.drawX += this.speed;
    this.drawY += this.speedY;

    for (var i = 0; i < enemies.length; i++) {
        if (this.drawX <= enemies[i].drawX + enemies[i].width && this.drawX >= enemies[i].drawX
            && this.drawY <= enemies[i].drawY + enemies[i].heigth && this.drawY >= enemies[i].drawY) {
            this.exploded = true;
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
    setTimeout(enemy_loop, 5000);
}

function start_loop() {
    is_playing = true;
    loop();
    enemy_loop()
}

function stop_loop(){
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