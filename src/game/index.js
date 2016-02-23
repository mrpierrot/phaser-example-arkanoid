var Phaser = require('phaser');

var GAME_INIT = "game_init";
var GAME_READY = "game_ready";
var GAME_BALL_RELEASED = "game_ball_released";
var GAME_OVER = "game_over";
var SCALE = 3;


var game = new Phaser.Game(240*SCALE, 200*SCALE, Phaser.AUTO, "phaser-workshop", {
	preload:_preload,
	create:_create,
	update:_update
} ,false,false); 


var ball =null,
	bar = null,
	bricks = null,
	state = null,
	cursor = null,
	ballSpeed = 600;


function _preload() {
	game.load.image('mosaic','game/assets/mosaic.png');
	game.load.image('brick-dust','game/assets/brick-dust.png');
	game.load.image('ball','game/assets/ball.png');
	game.load.image('bar','game/assets/bar.png');
	game.load.image('brick','game/assets/brick.png');
	game.load.json('level01','game/assets/levels/level01.json'); 
}


function _create() {

	game.stage.backgroundColor = "#363343";

	game.physics.startSystem(Phaser.Physics.ARCADE);

	ball = _createBall(0,0);
	bar = _createBar();
	bricks = game.add.group();
	bricks.enableBody = true;
	bricks.physicsBodyType = Phaser.Physics.ARCADE;
	
	game.world.add(bar);	



	cursor = game.input.keyboard.createCursorKeys();
	game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(_start,this);


	_loadLevel('level01');
	_reset();

	
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
	return ball;
}

function _launchBall(angle){
	ball.body.velocity.setTo(
		Math.cos(angle) * ballSpeed,
		Math.sin(angle) * ballSpeed
	);

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
		bricks.removeChildren();
		var json = game.cache.getJSON(name);
		var brickWidth = 16*SCALE,
			brickHeight = 8*SCALE;

		for (var y = 0,h=json.raw.length;y<h;y++) {
			var line = json.raw[y];
			for (var x = 0,w=line.length;x<w;x++) {
				var tile = line.charAt(x);
				switch(tile){
					case "X":
						var brick = new Brick(game, x*brickWidth, y*brickHeight, 'brick');
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
	state  = GAME_READY;
}

function _breakBrick(ball,brick){
	brick.destruct();
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

var Brick = function(game,x,y,asset){
		Phaser.Sprite.call(this,game,x,y,asset);
		this.game.physics.enable(this,Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.scale.set(SCALE);
}

var p = Brick.prototype = Object.create(Phaser.Sprite.prototype);
	p.varructor = Brick;

	p.destruct = function(){
		this.events.onKilled.addOnce(this._onKillHandler,this);
		this.kill();
	}

	p._onKillHandler = function(){
		var emitter = this.game.add.emitter(0, 0, 100);
	    emitter.makeParticles('brick-dust');
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
	



