var Phaser = require('phaser');

var GAME_INIT = "game_init";
var GAME_READY = "game_ready";
var GAME_BALL_RELEASED = "game_ball_released";
var GAME_OVER = "game_over";
var SCALE = 3;
var MAX_LIVES = 3;

WebFontConfig = {

    active: _createTexts,
    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Pacifico']
    }

};


var game = new Phaser.Game(224*SCALE, 192*SCALE, Phaser.AUTO, "phaser-workshop", {
	preload:_preload,
	create:_create,
	update:_update
} ,false,false); 


var currentLevel = 'level01',
	ball =null,
	bar = null,
	bricks = null,
	state = null,
	cursor = null,
	lives = MAX_LIVES,
	livesText = null,
	ballSpeed = 600;


function _preload() {
	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
	game.load.image('mosaic','game/assets/mosaic.png');
	game.load.image('brick-dust01','game/assets/brick-dust01.png');
	game.load.image('brick-dust02','game/assets/brick-dust02.png');
	game.load.image('brick-dust03','game/assets/brick-dust03.png');
	game.load.image('brick-dust04','game/assets/brick-dust04.png');
	game.load.image('ball','game/assets/ball.png');
	game.load.image('bar','game/assets/bar.png');
	game.load.image('brick01','game/assets/brick01.png');
	game.load.image('brick02','game/assets/brick02.png');
	game.load.image('brick03','game/assets/brick03.png');
	game.load.image('brick04','game/assets/brick04.png');
	game.load.image('background','game/assets/background.png');
	game.load.json('level01','game/assets/levels/level01.json'); 
}


function _create() {

	game.stage.backgroundColor = "#363343";

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.physics.arcade.checkCollision.down = false;


	var background = game.add.tileSprite(0, 0, game.width/SCALE, game.height/SCALE, 'background');
	background.scale.set(SCALE);

	ball = _createBall(0,0);
	bar = _createBar();
	bricks = game.add.group();
	bricks.enableBody = true;
	bricks.physicsBodyType = Phaser.Physics.ARCADE;
	


	cursor = game.input.keyboard.createCursorKeys();
	game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(_start,this);


	_loadLevel(currentLevel);
	_reset();

	
}

function _createTexts(){
	livesText = game.add.text(20, 10, 'Lives : '+lives, { font: "30px 'Pacifico'", fill: "#ffffff", align: "left" });
}

function _update() { 
	if(state == GAME_INIT) return;
	if(state == GAME_OVER) return;

	bar.body.velocity.x = 0;

	if (cursor.left.isDown)
    {
        bar.body.velocity.x = -200*SCALE;
    }
    else if (cursor.right.isDown)
    {
        bar.body.velocity.x = 200*SCALE;
    }

    if(state == GAME_BALL_RELEASED){
		
		game.physics.arcade.collide(bar, ball, null, _reflect, this);
		game.physics.arcade.collide(ball, bricks, null, _breakBrick, this);
	}else{
		ball.body.x = bar.body.x+(bar.width-ball.width)*0.5;
	}
	
}

function _createBall(x,y){
	var ball = game.add.sprite(x,y,'ball');
	ball.checkWorldBounds = true;
	ball.cacheAsBitmap = null;
	ball.scale.set(SCALE);
	game.physics.enable(ball,Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);
	ball.events.onOutOfBounds.add(_ballLost, this);
	return ball;
}

function _launchBall(angle){
	ball.body.velocity.setTo(
		Math.cos(angle) * ballSpeed,
		Math.sin(angle) * ballSpeed
	);

}

function _ballLost(){
	lives--;
	livesText.text = 'Lives : '+lives;
	_reset();
	if(lives <= 0){
		lives = MAX_LIVES;
		livesText.text = 'Lives : '+lives;
		_loadLevel(currentLevel);
		var gameOverText = game.add.text(game.width*0.5, game.height*0.5, 'Game Over', { font: "60px 'Pacifico'", fill: "#ffffff", align: "center" });
		gameOverText.anchor.set(0.5);
		game.add.tween(gameOverText)
		.to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true,2000)
		.onComplete.add(function(){
			gameOverText.destroy();
		});

	}
}

function _createBar(x,y){
	var bar = game.add.sprite(x,y,'bar');
	//this.anchor.set(0.5);
	bar.scale.set(SCALE);
	game.physics.enable(bar,Phaser.Physics.ARCADE);
	bar.body.immovable = true;
	bar.body.collideWorldBounds = true;
	return bar;
}


function _loadLevel(name){
		bricks.removeAll();
		var json = game.cache.getJSON(name);
		var brickWidth = 16*SCALE,
			brickHeight = 8*SCALE;
		for (var y = 0,h=json.raw.length;y<h;y++) {
			var line = json.raw[y];
			for (var x = 0,w=line.length;x<w;x++) {
				var tile = line.charAt(x);
				switch(tile){
					case "X":
						var brick = new Brick(game, x*brickWidth, y*brickHeight, (parseInt(Math.random()*4)+1));
						bricks.add(brick);

					break;
				}

			};
		};
	}

function _start(){
	if(state == GAME_READY){
		var angle = -90/180*Math.PI;
		ball.body.velocity.setTo(
			Math.cos(angle) * ballSpeed,
			Math.sin(angle) * ballSpeed
		);
		state = GAME_BALL_RELEASED;
	}
}

function _reset(){
	bar.x = (game.world.width-bar.width)*0.5;
	bar.y = game.world.height - bar.height - 10;
	ball.y = bar.y-ball.height;
	ball.x = bar.x+(bar.width-ball.width)*0.5;
	ball.body.velocity.setTo(0);
	state  = GAME_READY;
}

function _breakBrick(ball,brick){
	brick.destruct();
	if(bricks.length <= 0){
		var winText = game.add.text(game.width*0.5, game.height*0.5, 'You win !!!', { font: "60px 'Pacifico'", fill: "#ffffff", align: "center" });
		winText.anchor.set(0.5);
		game.add.tween(winText)
		.to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true,2000)
		.onComplete.add(function(){
			winText.destroy();
		});
	}
	return true;
}

function _reflect(bar, ball) {

    if (ball.y > (bar.y + 5))
    {
        return true;
    }
    else
    {
    	var rate = (1-(ball.x+ball.width*0.5-bar.x)/bar.width);
    	if(rate < 0.1)rate=0.1;
    	if(rate > 0.9)rate=0.9;
    	var angle = -Math.PI*rate;
    	_launchBall(angle);
        return false;
    }
}



/***************************************************/
/********************** Brick **********************/
/***************************************************/

var Brick = function(game,x,y,index){
		Phaser.Sprite.call(this,game,x,y,'brick0'+index);
		this.index = index;
		this.game.physics.enable(this,Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.scale.set(SCALE);
}

var p = Brick.prototype = Object.create(Phaser.Sprite.prototype);
	p.varructor = Brick;

	p.destruct = function(){
		this.events.onKilled.addOnce(this._onKillHandler,this);
		this.destroy();
	}

	p._onKillHandler = function(){
		var emitter = this.game.add.emitter(0, 0, 100);
	    emitter.makeParticles('brick-dust0'+this.index);
	    emitter.x = this.x+this.width*0.5;
	    emitter.y = this.y+this.height*0.5;
	    emitter.minParticleSpeed.setTo(-50*SCALE, -50*SCALE);
    	emitter.maxParticleSpeed.setTo(50*SCALE, 50*SCALE);
    	emitter.minParticleScale = 1*SCALE;
    	emitter.maxParticleScale = 1.5*SCALE;
	    emitter.start(true,300,null,10);
	  
	    this.game.time.events.add(2000,function(){
	    	emitter.destroy();	
	    });
	}
	



