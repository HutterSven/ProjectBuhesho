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
}

Player.prototype.draw = function(){
    this.check_keys();
    main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);
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

}

function Enemy(y, x) {
    this.drawX = x;
    this.drawY = y;
    this.srcY = 176;
    this.srcX = 15;
    this.width = 19;
    this.heigth = 16;
    this.speed = 1;
}

Enemy.prototype.draw = function(){
    this.ai();
    main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width, this.heigth);
}

Enemy.prototype.ai = function () {
    this.drawX -= this.speed;
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

    background_ctx.drawImage(bg_sprite, player.bg_X, player.bg_Y);
    if (is_playing)
        requestaframe(loop);
}

function enemy_loop() {
    spawn_enemy(Math.floor(Math.random()*6)+1);
    setTimeout(enemy_loop, 3000);
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
}