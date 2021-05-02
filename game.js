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
}

Player.prototype.draw = function(){
    this.check_keys();
    if (this.exploded == true) stop_loop();

    main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);

    if (this.exploded == true) {

        player_ctx.drawImage(main_sprite, 8, 137, 15, 13, this.drawX-10, this.drawY, 15, 13);
        setInterval(Player.prototype.draw, 250);
        player_ctx.clearRect(0,0,800,600);

        player_ctx.drawImage(main_sprite, 37, 134, 21, 20, this.drawX-10, this.drawY, 21, 20);
        setInterval(Player.prototype.draw, 250);
        player_ctx.clearRect(0,0,800,600);

        player_ctx.drawImage(main_sprite, 66, 131, 26, 27, this.drawX-10, this.drawY, 26, 27);
        setInterval(Player.prototype.draw, 250);
        player_ctx.clearRect(0,0,800,600);

        player_ctx.drawImage(main_sprite, 98, 129, 28, 29, this.drawX-10, this.drawY, 28, 29);
        setInterval(Player.prototype.draw, 250);
        player_ctx.clearRect(0,0,800,600);

        player_ctx.drawImage(main_sprite, 128, 129, 31, 30, this.drawX-10, this.drawY, 31, 30);
        setInterval(Player.prototype.draw, 250);
        player_ctx.clearRect(0,0,800,600);

        player_ctx.drawImage(main_sprite, 160, 128, 32, 32, this.drawX-10, this.drawY, 32, 32);
        setInterval(Player.prototype.draw, 250);
        player_ctx.clearRect(0,0,800,600);

        player_ctx.drawImage(main_sprite, 192, 128, 32, 32, this.drawX-10, this.drawY, 32, 32);
        setInterval(Player.prototype.draw, 250);
        player_ctx.clearRect(0,0,800,600);

        player_ctx.drawImage(main_sprite, 225, 129, 31, 31, this.drawX-10, this.drawY, 31, 31);
        setInterval(Bullet.prototype.draw, 1000);
        player_ctx.clearRect(0,0,800,600);

    }
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
        friendlyBullets[friendlyBullets.length] = new FriendlyBullet(this.drawX+this.width, this.drawY+this.heigth/2);
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

    if (this.drawX <= player.drawX + player.width && this.drawX >= player.drawX
        && this.drawY <= player.drawY + player.heigth && this.drawY >= player.drawY) {
        this.drawY = 1000;
        this.exploded = true;
        this.hitType = 1;
    }

    if (this.exploded == true && this.firstIteration == true) {


        enemy_ctx.drawImage(main_sprite, 8, 137, 15, 13, this.drawX-10, this.drawY, 15, 13);
        setInterval(Enemy.prototype.draw, 250);
        setTimeout(enemy_ctx.clearRect(0,0,800,600), 250),

        setTimeout(main_ctx.drawImage(main_sprite, 37, 134, 21, 20, this.drawX-10, this.drawY, 21, 20), 250);
        setInterval(Enemy.prototype.draw, 250);
        setTimeout(enemy_ctx.clearRect(0,0,800,600), 500);

        setTimeout(enemy_ctx.drawImage(main_sprite, 66, 131, 26, 27, this.drawX-10, this.drawY, 26, 27), 500);
        setInterval(Enemy.prototype.draw, 250);
        setTimeout(enemy_ctx.clearRect(0,0,800,600), 750);

        setTimeout(enemy_ctx.drawImage(main_sprite, 98, 129, 28, 29, this.drawX-10, this.drawY, 28, 29), 750);
        setInterval(Enemy.prototype.draw, 250);
        setTimeout(enemy_ctx.clearRect(0,0,800,600), 1000);

        setTimeout(enemy_ctx.drawImage(main_sprite, 128, 129, 31, 30, this.drawX-10, this.drawY, 31, 30), 1000);
        setInterval(Enemy.prototype.draw, 250);
        setTimeout(enemy_ctx.clearRect(0,0,800,600), 1250);

        setTimeout(enemy_ctx.drawImage(main_sprite, 160, 128, 32, 32, this.drawX-10, this.drawY, 32, 32), 1250);
        setInterval(Enemy.prototype.draw, 250);
        setTimeout(enemy_ctx.clearRect(0,0,800,600),1500);

        setTimeout(enemy_ctx.drawImage(main_sprite, 192, 128, 32, 32, this.drawX-10, this.drawY, 32, 32), 1500);
        setInterval(Enemy.prototype.draw, 250);
        setTimeout(enemy_ctx.clearRect(0,0,800,600), 1750);

        setTimeout(enemy_ctx.drawImage(main_sprite, 225, 129, 31, 31, this.drawX-10, this.drawY, 31, 31), 1750);
        setInterval(Enemy.prototype.draw, 1000);
        setTimeout(enemy_ctx.clearRect(0,0,800,600), 2000);

        this.firstIteration = false;

        if (this.hitType == 1) {
            stop_loop();
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

function FriendlyBullet(x, y) {
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
FriendlyBullet.prototype.draw = function() {
    if (this.exploded == false) {
        main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);
    }
    this.drawX += this.speed;

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


//Quelle: https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function spawn_enemy(n) {
    var y_position = 600/(n+1);
    for (var i = 0; i < n; i++){
        enemies[enemies.length] = new Enemy(y_position*(i+1), Math.floor(Math.random()*100)+830);
    }
}

function loop(){
    main_ctx.clearRect(0,0,800,600);
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

    background_ctx.drawImage(bg_sprite, player.bg_X, player.bg_Y);
    background_ctx.drawImage(bg_sprite, player.bg_X+800, player.bg_Y);

    player.bg_X -= 8;

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