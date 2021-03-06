//Quelle: Musik: https://freemusicarchive.org/genre/Chiptune?sort=date&d=0&pageSize=20&page=2 : sawsquarenoise / Boss Theme
//Quelle: Lasersound: https://www.zapsplat.com/sound-effect-category/lasers-and-weapons/ : Science fiction laser hit, impact with a thud 1
//Quelle: Explosion: https://www.zapsplat.com/sound-effect-category/lasers-and-weapons/ : Science fiction, large explosion 3
//Quelle: City Layers: City vector created by freepik - www.freepik.com

var version = '0.0.1';
var is_playing = false;
var in_level;
var level = 1;
var player;
var enemies;
var powerUp;
var space_sprite = new Image();
var city_sprite1 = new Image();
var city_sprite2 = new Image();
var main_sprite = new Image();
var music;
var explosionSound;
var bulletSound;
var itemSound;
var rocketSound;
var spacePos;
var city1Pos;
var city2Pos;
var speedSpace;
var speedCity1;
var speedCity2;
var startTime;
var deaded_dudes = 0;
var size_scale = 2;
var fontLevel;
var fontScore;
var fontButton;
var fontTitle;
var enemyBullets;
var friendlyBullets;
var enemiesSpawning;
var score;
var isDead;
var inSequence;
var spawnEnemy;
var spawnPowerup;
var missileTimer;
var laser;
var enemySpawnTime = 4000;
var enemyBulletSpawn = 2000;
init();

function init() {
    background_canvas = document.getElementById('space_canvas');
    background_ctx = background_canvas.getContext('2d');
    bullet_canvas = document.getElementById('bullet_canvas');
    bullet_ctx = bullet_canvas.getContext('2d');
    player_canvas = document.getElementById('player_canvas');
    player_ctx = player_canvas.getContext('2d');
    enemy_canvas = document.getElementById('enemy_canvas');
    enemy_ctx = enemy_canvas.getContext('2d');
    explosion_canvas = document.getElementById('explosion_canvas');
    explosion_ctx = explosion_canvas.getContext('2d');
    city_canvas_layer1 = document.getElementById('city_canvas_layer1');
    city_layer1_ctx =  city_canvas_layer1.getContext('2d');
    city_canvas_layer2 = document.getElementById('city_canvas_layer2');
    city_layer2_ctx =  city_canvas_layer2.getContext('2d');
    levelText_canvas = document.getElementById('levelText_canvas');
    levelText_ctx = levelText_canvas.getContext('2d');
    highScore_canvas = document.getElementById('highScore_canvas');
    highScore_ctx = highScore_canvas.getContext('2d');

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
    enemies = [];
    enemyBullets = [];
    friendlyBullets = [];
    powerUp = [];
    enemiesSpawning = 3;
    score = 0;
    isDead = false;
    inSequence = false;
    missileTimer = 0;

    load_media();
}

function load_media() {
    space_sprite = new Image();
    space_sprite.src = 'images/Background_Sprite_1.png';
    city_sprite1 = new Image();
    city_sprite1.src = 'images/Background_Sprite_2.png'
    city_sprite2 = new Image();
    city_sprite2.src = 'images/Background_Sprite_3.png'
    main_sprite = new Image();
    main_sprite.src = 'images/main_sprite.png';
    fontLevel = "bold 100px Audiowide";
    fontScore = "bold 30px Audiowide";
    fontButton = "bold 50px Audiowide";
    fontTitle = "bold 80px Audiowide";

    levelText_ctx.fillStyle = "white";
    levelText_ctx.font = fontLevel;
    highScore_ctx.fillStyle = "white";
    highScore_ctx.font = fontScore;


    music = new Audio("sounds/theme.mp3");
    explosionSound = new Audio("sounds/explosion.mp3");
    bulletSound = new Audio("sounds/laser.mp3");
    itemSound = new Audio("sounds/itemCollected.mp3");
    rocketSound = new Audio("sounds/rocket.mp3");

}

function Player() {
    this.drawX = 50;
    this.drawY = 300;
    this.srcY = 221;
    this.srcX = 62;
    this.width = 21;
    this.heigth = 23;
    this.speed = 5;
    this.is_downkey = false;
    this.is_upkey = false;
    this.is_leftkey = false;
    this.is_rightkey = false;
    this.is_spacekey = false;
    this.exploded = false;
    this.powerUp = 0;
    this.shootspeed = 0.3;
    this.shootactive = false;
    this.gameOverTimer = 0;
}

Player.prototype.draw = function(){
    this.check_keys();
    player_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width*size_scale, this.heigth*size_scale);

    if (this.exploded) {
                /*
                isDead = true;
                is_playing = false;
                in_level = false;
                this.is_spacekey = false;
                explode1(this.drawX, this.drawY);

                explodeAll();

                this.gameOverTimer = new Date() / 1000;
                player_ctx.clearRect(0,0,800,600);
                enemy_ctx.clearRect(0,0,800,600);
                highScore_ctx.clearRect(0,0,800,600);
*/
    }
}

Player.prototype.check_keys = function (){
    if(this.is_downkey && this.drawY <= 550){
        this.drawY+=this.speed;
    };

    if(this.is_upkey && this.drawY >= 20){
        this.drawY-=this.speed;
    };

    if(this.is_rightkey && this.drawX <= 750){
        this.drawX += this.speed;

    };

    if(this.is_leftkey && this.drawX >= 20){
        this.drawX -= this.speed;

    };

    if(this.is_spacekey && in_level){

        if(player.powerUp == 1){
            player.shootspeed = 0.15;
        }
        if(player.powerUp == 2){
            player.shootspeed = 0.075;
        }
        if(player.powerUp == 4){
            player.shootspeed = 0.075;
        }
        if(this.shootactive == false){
            shoot();
        }
    }

    if(this.is_spacekey && !in_level && !is_playing && !inSequence) {
        if (new Date() / 1000 - this.gameOverTimer > 1) {
            enemies = [];
            enemyBullets = [];
            friendlyBullets = [];
            powerUp = [];
            in_level = true;
            startTime = Math.floor(new Date() / 1000);
            spawnEnemy = Math.floor(new Date() / 1000);
            spawnPowerup = Math.floor(new Date() / 1000);
            enemiesSpawning = 3;

            level = 1;
            score = 0;
            enemiesSpawning = 3;

            player.drawX = 50;
            player.drawY = 300;
            player.exploded = false;
            player.powerUp = 0;
            player.shootspeed = 0.3;
            player.shootactive = false;

            is_playing = true;
            inSequence = false;
            isDead = false;
            player.exploded = false;

            explodeAll();
        }
    }
}

function shoot() {
    player.shootactive = true;
    if (player.is_spacekey){
        if (!(player.powerUp >= 4 && (new Date() - missileTimer >= 500 || missileTimer == 0))) friendlyBullets[friendlyBullets.length] = new FriendlyBullet(player.drawX+player.width, player.drawY+player.heigth*size_scale/2, 0);
        if (player.powerUp >= 3) {
            friendlyBullets[friendlyBullets.length] = new FriendlyBullet(player.drawX+player.width, player.drawY+player.heigth*size_scale/2, 3);
            friendlyBullets[friendlyBullets.length] = new FriendlyBullet(player.drawX+player.width, player.drawY+player.heigth*size_scale/2, -3);
        }
        if (player.powerUp >= 4 && (new Date() - missileTimer >= 500 || missileTimer == 0)) {
            friendlyBullets[friendlyBullets.length] = new FriendlyBullet(player.drawX+player.width, player.drawY+player.heigth*size_scale/2, 0, true);
            missileTimer = new Date();
        }
        if (player.powerUp >= 5) laser = new Laser(player.drawX+player.width);
        setTimeout(shoot, player.shootspeed*1000);
    }else{
        player.shootactive = false;
    }
}


function FriendlyBullet(x, y, speedY, missile) {
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
    this.missile = missile;

    if (this.missile) {
        this.srcX = 178;
        this.srcY = 4;
        this.width = 13;
        this.heigth = 6;
        this.playerPosition = player.drawY;
    }

    if (!this.missile) playBullet();
    else playRocket();
}

FriendlyBullet.prototype.draw = function() {
    if (this.exploded == false) {
        bullet_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width*size_scale, this.heigth*size_scale);
    }

    if (this.drawY >= 600 || this.drawY <= 0) {this.speedY*=-1;};

    if (this.missile && this.drawY - this.playerPosition <= 50) {
        this.drawY += this.speed/2;
        this.waitMissile = new Date();
    }
    else {
        if (new Date() - this.waitMissile >= 250 || !this.missile) this.drawX += this.speed;
        this.drawY += this.speedY;
    }

    for (var i = 0; i < enemies.length; i++) {

        if (checkHit(this, enemies[i])) {
            if (!this.missile) {
                this.exploded = true;
            }
        }

        if ((this.exploded && this.firstIteration) || (this.missile && checkHit(this, enemies[i]))) {
            enemies[i].hits--;
            if (this.missile) enemies[i].hits = 0;
            if (enemies[i].hits < 1) {
                enemies[i].exploded = true;
                score += enemies[i].type*1000;
                deaded_dudes++;
            }
            this.firstIteration = false;
        }

    }
    if (this.exploded || this.drawX > 800) {
        this.drawY = 1337;
        this.drawX = -1337;
        this.speed = 0;
        this.missile = false;
    }
}

function Laser(x){
    this.drawX = player.drawX + player.width;
    this.drawY = player.drawY + player.heigth/2 + this.heigth;
    this.srcX = 73;
    this.srcY = 392;
    this.width = 16;
    this.heigth = 7;
}

Laser.prototype.draw = function() {
    if (player.is_spacekey) {
        this.drawX = player.drawX + player.width;
        this.drawY = player.drawY + player.heigth/2 + this.heigth -3 ;
        bullet_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width*150, this.heigth*size_scale*2);
    }

    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].drawY+enemies[i].heigth >= this.drawY && enemies[i].drawY <= this.drawY ||
            enemies[i].drawY+enemies[i].heigth >= this.drawY+this.heigth*size_scale*2 && enemies[i].drawY <= this.drawY+this.heigth*size_scale*2){
            enemies[i].hits = 0;
            enemies[i].exploded = true;
            score += enemies[i].type*1000;
            deaded_dudes++;
        }
    }
}

function Enemy(y, x, type, moving) {
    this.drawX = x;
    this.drawY = y;
    this.srcY = 176;
    this.srcX = 15;
    this.width = 19;
    this.heigth = 16;
    this.type = type;
    this.moving = moving;
    this.hits = 1;
    this.distanceY = this.drawY;
    this.direction = 1;
    this.shootTime = Math.floor(new Date() / 1000);
    if (this.type == 2) {
        this.srcY = 170;
        this.srcX = 153;
        this.width = 30;
        this.heigth = 32;
        this.hits = 3;
    }
    this.speed = 1;
    this.exploded = false;
    this.firstIteration = true;
    this.hitType = 0;
}

Enemy.prototype.draw = function(){
    this.ai();
    if (this.exploded == false) {
        enemy_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width*size_scale, this.heigth*size_scale);
    }

    if (this.exploded && this.firstIteration == false) {
        this.drawY = -3000;
        this.drawX = -3000;
        this.heigth = 0;
        this.width = 0;
    }

    if (checkHit(this, player)) {
        this.exploded = true;
        this.hitType = 1;
    }

    if (this.exploded && this.firstIteration) {

        explode1(this.drawX, this.drawY);

        this.firstIteration = false;

        if (this.hitType == 1) {
            player.exploded = true;
        }
    }
}

Enemy.prototype.ai = function () {
    this.drawX -= this.speed;
    if (!this.moving) {
        this.direction = 0;
    }
    else if (this.moving && this.distanceY - this.drawY >= 75) {
        this.direction = 1;
    }
    else if (this.moving && this.distanceY - this.drawY <= -75) {
        this.direction = -1;
    }

    this.drawY += (this.speed*2)*this.direction;

    if (new Date() - this.shootTime >= enemyBulletSpawn / (1+level/10) && this.exploded == false) {
        this.shootTime = Math.floor(new Date());
        enemyBullets[enemyBullets.length] = new EnemyBullet(this.drawX-(this.width*size_scale/2), this.drawY+(this.heigth*size_scale/2));
    }
}

function spawn_enemy(n, moving) {
    var y_position = 600 / (n + 1);
    type = 1;

    if (level > 1) type = Math.floor(Math.random() * 2) + 1;

    for (var i = 0; i < n; i++) {
        enemies[enemies.length] = new Enemy(y_position * (i + 1), Math.floor(Math.random() * 100) + 830, type, moving);
    }
}

function EnemyBullet(x, y) {
    this.drawX = x;
    this.drawY = y;
    this.srcX = 208;
    this.srcY = 119;
    this.width = 11;
    this.heigth = 3;
    this.speed = 6;
    this.exploded = false;
    this.firstIteration = true;
    playBullet();

}
EnemyBullet.prototype.draw = function() {
    if (this.exploded == false) {
        bullet_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width*size_scale, this.heigth*size_scale);
    }
    this.drawX -= this.speed;

    if (checkHit(this, player)) {
        this.exploded = true;
    }

    if (this.exploded && this.firstIteration && !inSequence) {

        this.firstIteration = false;

        player.exploded = true;
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
    this.firstIteration = true;
}

PowerUp.prototype.draw = function(){
    if (this.gotted == false) {
        player_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.heigth, this.drawX, this.drawY, this.width*2*size_scale, this.heigth*2*size_scale);
    }

    this.drawX-=this.speed;

    if (checkHit(this, player)) {
        this.gotted = true;
    }

    if (this.gotted && this.firstIteration) {
        player.powerUp++;
        itemSound.volume = 1;
        itemSound.play();
        this.drawY = -3000;
        this.drawX = -3000;
        this.heigth = 0;
        this.width = 0;
        this.firstIteration = false;
    }
}

function loop(){
    if (!is_playing) {
        player.check_keys();

        initializeContexts();

        city_layer2_ctx.font = fontButton;
        city_layer2_ctx.fillStyle = "white";

        //Quelle: https://stackoverflow.com/questions/13771310/center-proportional-font-text-in-an-html5-canvas
        if (isDead) {
            //Quelle: https://www.w3schools.com/html/html5_webstorage.asp
            var highscore = score;
            if (highscore > localStorage.getItem("highscore")){
                localStorage.setItem("highscore", score);
            }else{
                highscore = localStorage.getItem("highscore")
            }

            var messageText = "Game Over";
            var textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 275);
            city_layer2_ctx.font = fontScore;
            var messageText = "Your Score is: ";
            var textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 325);
            var messageText = score;
            var textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 375);
            var messageText = "Your Highscore is: ";
            var textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 425);
            var messageText = highscore;
            var textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 475);
        }
        else {
            city_layer2_ctx.font = fontTitle;
            city_layer2_ctx.fillStyle = 'pink';
            var messageText = "Project BuHeSho";
            var textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 275);
            city_layer2_ctx.font = fontButton;
            city_layer2_ctx.fillStyle = 'white';
            messageText = "Pay2Win-Edition";
            textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 360);
            city_layer2_ctx.font = fontButton;
            city_layer2_ctx.fillStyle = 'white';
            messageText = "Press SPACE to play";
            textWidth = city_layer2_ctx.measureText(messageText).width;
            city_layer2_ctx.fillText(messageText , (city_canvas_layer2.width/2) - (textWidth / 2), 425);
        }

        spacePos -= 1;
        city1Pos -= 2;
        city2Pos -= 3;

        resetPositions();

    }

    if (is_playing) {
        bullet_ctx.clearRect(0, 0, 800, 600);
        enemy_ctx.clearRect(0, 0, 800, 600);
        player_ctx.clearRect(0, 0, 800, 600);
        highScore_ctx.clearRect(0, 0, 800, 600);
        highScore_ctx.fillText("Score: " + score, 20, 40);

        if (new Date() / 1000 - startTime >= 30) {
            level++;
            if (enemiesSpawning < 5) enemiesSpawning = level * 3;
            in_level = false;
            inSequence = true;
            speedCity1 *= 4;
            speedCity2 *= 4;
            speedSpace *= 4;
            startTime = Math.floor(new Date() / 1000);

            explodeAll();

        }

        if (new Date() / 1000 - startTime >= 3 && inSequence) {
            powerUp = [];
            enemyBullets = [];
            friendlyBullets = [];
            enemies = [];
            player.is_spacekey = false;
            levelText_ctx.clearRect(0, 0, 800, 600);
            speedCity1 = 4;
            speedCity2 = 5;
            speedSpace = 3;
            levelText_ctx.fillText("Level " + level, 200, 300);
        }


        if (new Date() / 1000 - startTime >= 5 && !in_level) {
            levelText_ctx.clearRect(0, 0, 800, 600);
            betweenLevels();
        }

        player.draw();

        if (Math.floor(new Date() - spawnEnemy) >= enemySpawnTime && !inSequence) {
            spawnEnemy = Math.floor(new Date());
            spawn_enemy(Math.floor(Math.random() * enemiesSpawning) + 1, Math.random() < 0.5);
        }

        if (Math.floor(new Date()/1000 - spawnPowerup) == 20 && !inSequence) {
            spawnPowerup = Math.floor(new Date() / 1000);
            spawn_powerUp();
        }


        if (music.paused) {
            music.volume = 1;
            music.play();
        }

        if (laser != null) laser.draw();

        for (var i = 0; i < powerUp.length; i++) {
            powerUp[i].draw();
        }

        for (var i = 0; i < enemies.length; i++) {
            enemies[i].draw();
        }
        for (var i = 0; i < enemyBullets.length; i++) {
            enemyBullets[i].draw();
        }

        for (var i = 0; i < friendlyBullets.length; i++) {
            friendlyBullets[i].draw();
        }

        //Source: https://www.geeksforgeeks.org/html5-game-development-infinitely-scrolling-background/
        initializeContexts();

        spacePos -= speedSpace;
        city1Pos -= speedCity1;
        city2Pos -= speedCity2;

        resetPositions();

    }

    requestaframe(loop);
}


function checkHit(object1, object2) {
    return ((object1.drawX <= object2.drawX + object2.width*size_scale && object1.drawX >= object2.drawX
        || object1.drawX+object1.width <= object2.drawX + object2.width*size_scale && object1.drawX+object1.width*size_scale >= object2.drawX)
        && (object1.drawY <= object2.drawY + object2.heigth*size_scale && object1.drawY >= object2.drawY
        || object1.drawY+object1.heigth <= object2.drawY + object2.heigth*size_scale && object1.drawY+object1.heigth*size_scale >= object2.drawY));
}


function explodeAll() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].exploded = true;
    }

    for (var i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].exploded = true;
    }

    for (var i = 0; i < powerUp.length; i++) {
        powerUp[i].gotted = true;
        powerUp[i].firstIteration = false;
    }

    for (var i = 0; i < friendlyBullets.length; i++) {
        friendlyBullets[i].exploded = true;
    }
}

function resetPositions() {
    if (spacePos < -1000) spacePos = 0;
    if (city1Pos < -2000) city1Pos = 0;
    if (city2Pos < -2000) city2Pos = 0;
}

function initializeContexts() {
    background_ctx.clearRect(0, 0, 800, 600);
    background_ctx.drawImage(space_sprite, spacePos, 0);
    background_ctx.drawImage(space_sprite, spacePos + 999, 0);

    city_layer1_ctx.clearRect(0, 0, 800, 4000);
    city_layer1_ctx.drawImage(city_sprite1, city1Pos, -100);
    city_layer1_ctx.drawImage(city_sprite1, city1Pos + 2000, -100);

    city_layer2_ctx.clearRect(0, 0, 800, 4000);
    city_layer2_ctx.drawImage(city_sprite2, city2Pos, -100);
    city_layer2_ctx.drawImage(city_sprite2, city2Pos + 2000, -100);
}

function betweenLevels() {
    in_level = true;
    inSequence = false;
    spawnPowerup = Math.floor(new Date() / 1000);
    spawnEnemy = Math.floor(new Date() / 1000);
    startTime = Math.floor(new Date() / 1000);
}

function spawn_powerUp() {
    if (!isDead) powerUp[powerUp.length] = new PowerUp(Math.floor(Math.random()*550)+25, 830);
}

function start_loop() {
    speedCity1 = 4;
    speedCity2 = 5;
    speedSpace = 3;
    spacePos = 0;
    city1Pos = 0;
    city2Pos = 0;
    startTime = Math.floor(new Date() / 1000);
    is_playing = false;
    loop();
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

//Quelle: https://stackoverflow.com/questions/6893080/html5-audio-play-sound-repeatedly-on-click-regardless-if-previous-iteration-h
function playBullet() {
    var bulletShot = bulletSound.cloneNode();
    bulletShot.volume=0.025;
    bulletShot.play();
}

function playRocket() {
    var rocket = rocketSound.cloneNode();
    rocket.volume=0.2;
    rocket.play();
}

function playExplosion() {
    var explosion = explosionSound.cloneNode();
    explosion.volume=0.25;
    explosion.play();
}

function explode1(x, y) {
    explosion_ctx.drawImage(main_sprite, 8, 137, 15, 13, x, y, 15*size_scale, 13*size_scale);
    playExplosion();
    setTimeout(function(){explode2(x,y)}, 80);
}

function explode2(x, y) {
    width = 21*size_scale;
    height = 20*size_scale;
    clearExplosion(x, y, width, height);
    explosion_ctx.drawImage(main_sprite, 37, 134, 21, 20, x, y, width, height);
    setTimeout(function(){explode3(x, y)}, 80);
}

function explode3(x, y) {
    width = 26*size_scale;
    height = 27*size_scale;
    clearExplosion(x, y, width, height);
    explosion_ctx.drawImage(main_sprite, 66, 131, 26, 27, x, y, 26*size_scale, 27*size_scale);
    setTimeout(function(){explode4(x, y)}, 80);
}

function explode4(x, y) {
    width = 28*size_scale;
    height = 29*size_scale;
    clearExplosion(x, y, width, height);
    explosion_ctx.drawImage(main_sprite, 98, 129, 28, 29, x, y, 28*size_scale, 29*size_scale);
    setTimeout(function(){explode5(x, y)}, 80);
}

function explode5(x, y) {
    width = 31*size_scale;
    height = 30*size_scale;
    clearExplosion(x, y, width, height);
    explosion_ctx.drawImage(main_sprite, 128, 129, 31, 30, x, y, 31*size_scale, 30*size_scale);
    setTimeout(function(){explode6(x, y)}, 80);
}

function explode6(x, y) {
    width = 32*size_scale;
    height = 32*size_scale;
    clearExplosion(x, y, width, height);
    explosion_ctx.drawImage(main_sprite, 160, 128, 32, 32, x, y, 32*size_scale, 32*size_scale)
    setTimeout(function(){explode7(x, y)}, 80);
}

function explode7(x, y) {
    width = 32*size_scale;
    height = 32*size_scale;
    clearExplosion(x, y, width, height);
    explosion_ctx.drawImage(main_sprite, 192, 128, 32, 32, x, y, 32*size_scale, 32*size_scale);
    setTimeout(function(){explode8(x, y)}, 80);
}

function explode8(x, y) {
    width = 31*size_scale;
    height = 31*size_scale;
    explosion_ctx.drawImage(main_sprite, 225, 129, 31, 31, x, y, 31*size_scale, 31*size_scale);
    clearExplosion(0, 0, 800, 600);
}

function clearExplosion(x, y, width, height) {
    explosion_ctx.clearRect(x,y,width,height);
}