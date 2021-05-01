var version = '0.0.1';
var is_playing = false;
var player;
var speed = 5;

init();

function init() {
    background_canvas = document.getElementById('background_canvas');
    background_ctx = main_canvas.getContext('2d');
    main_canvas = document.getElementById('main_canvas');
    main_ctx = main_canvas.getContext('2d');

    document.addEventListener("keydown", key_down, false);

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
}

function mouse(e) {
    var x = e.pageX - document.getElementById('game_object').offsetLeft;
    var y = e.pageY - document.getElementById('game_object').offsetTop;
}

var r_y = 0;
var r_x = 0;

function Player() {
    this.drawX = 0;
    this.drawY = 0;
    this.speed = 1;
    this.is_downkey = false;
    this.is_upkey = false;
    this.is_leftkey = false;
    this.is_rightkey = false;
}

Player.prototype.draw = function(){
    main_ctx.fillStyle = 'red';
    main_ctx.fillRect(this.drawX,this.drawY,20,20,);
}

Player.prototype.check_keys = function (){
    if(this.is_downkey == true)
        this.drawY+=this.speed;
}

function loop(){
    main_ctx.clearRect(0,0,800,600)
    player.draw();
    if (is_playing)
        requestaframe(loop);
}

function start_loop() {
    is_playing = true;
    loop();
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