import config from '../config.js';

import Ball from '../prefabs/Ball.js';
import Bar from '../prefabs/Bar.js';
import Brick from '../prefabs/Brick.js';
import LowRez from 'phaser-lowrez/LowRez';

const GAME_INIT = "game_init";
const GAME_READY = "game_ready";
const GAME_BALL_RELEASED = "game_ball_released";
const GAME_OVER = "game_over";

export default class GameState extends Phaser.State {



	constructor(){
		super();
		this.state = GAME_INIT;
	}


	init(){
		this.game.plugins.lowrez = this.game.plugins.add(LowRez,{scale:3});
		this.game.time.advancedTiming = true;
	}

	preload() {

		this.game.load.image('mosaic','game/assets/mosaic.png');
  		this.game.load.image('ball','game/assets/ball.png');
  		this.game.load.image('bar','game/assets/bar.png');
  		this.game.load.image('brick','game/assets/brick.png');
  		this.game.load.json('level01','game/assets/levels/level01.json');

	}

	create() {
		this.game.plugins.lowrez.setTexture(this.game.cache.getImage('mosaic'));
		this.game.stage.backgroundColor = "#363343";

		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		


		this.ball = new Ball(this.game,0,0,'ball');
		this.bar = new Bar(this.game, 0, 0, 'bar');
		this.bricks = this.game.add.group();
		this.bricks.enableBody = true;
    	this.bricks.physicsBodyType = Phaser.Physics.ARCADE;

		this.world.add(this.ball);	
		this.world.add(this.bar);	

		//this.game.world.addChild(this.bricks);	


		this.cursors = this.game.input.keyboard.createCursorKeys();
		this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR).onDown.add(this._launchBall,this);


		this._loadLevel('level01');
		this._playLife();

		
	}

	update() { 
		if(this.state == GAME_INIT) return;
		if(this.state == GAME_OVER) return;

		this.bar.body.velocity.x = 0;

		if (this.cursors.left.isDown)
	    {
	        this.bar.body.velocity.x = -200;
	    }
	    else if (this.cursors.right.isDown)
	    {
	        this.bar.body.velocity.x = 200;
	    }

	    if(this.state == GAME_BALL_RELEASED){
			
			this.game.physics.arcade.collide(this.bar, this.ball, null, this._reflect, this);
			this.game.physics.arcade.collide(this.ball, this.bricks, null, this._breakBrick, this);
		}else{
			this.ball.body.x = this.bar.body.x+(this.bar.width-this.ball.width)*0.5;
		}
		

	}

	preRender(){


	}

	render(){
		this.game.plugins.lowrez.postRender();
		this.game.debug.geom(this.ball);
		this.game.debug.text(this.game.time.fps || '--', 2, 14, "#00ff00"); 
		
	}

	_loadLevel(name){
		this.bricks.removeChildren();
		const json = this.game.cache.getJSON(name);
		const brickWidth = 16,
			brickHeight = 8;


				console.log(json);

		for (let y = 0,h=json.raw.length;y<h;y++) {
			let line = json.raw[y];
			for (let x = 0,w=line.length;x<w;x++) {
				let tile = line.charAt(x);
				switch(tile){
					case "X":
						let brick = new Brick(this.game, x*brickWidth, y*brickHeight, 'brick');
						this.bricks.add(brick);

					break;
				}

			};
		};






	}

	_launchBall(){
		if(this.state == GAME_READY){
			this.ball.launch(-90/180*Math.PI);
			this.state = GAME_BALL_RELEASED;
		}
	}

	_playLife(){
		this.bar.x = (this.world.width-this.bar.width)*0.5;
		this.bar.y = this.world.height - this.bar.height - 10;
		this.ball.y = this.bar.y-this.ball.height;
		this.ball.x = this.bar.x+(this.bar.width-this.ball.width)*0.5;
		this.state  = GAME_READY;
	}

	_breakBrick(ball,brick){
		brick.kill();
		return true;
	}

	_reflect(bar, ball) {

	    if (ball.y > (bar.y + 5))
	    {
	        return true;
	    }
	    else
	    {
	    	let rate = (1-(ball.x+ball.width*0.5-bar.x)/bar.width);
	    	if(rate < 0.1)rate=0.1;
	    	if(rate > 0.9)rate=0.9;
	    	let angle = -Math.PI*rate;
	    	this.ball.launch(angle);
	        return false;
	    }
	}


}
