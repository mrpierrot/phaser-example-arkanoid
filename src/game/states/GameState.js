import config from '../config.js';

import Ball from '../prefabs/Ball.js';
import Bar from '../prefabs/Bar.js';
import Brick from '../prefabs/Brick.js';
import LowRez from 'phaser-lowrez/LowRez';


export default class GameState extends Phaser.State {


	init(){
		this.game.plugins.lowrez = this.game.plugins.add(LowRez,{scale:4});
	}

	preload() {
		this.game.load.image('mosaic','game/assets/mosaic.png');
  		this.game.load.image('ball','game/assets/ball.png');
  		this.game.load.image('bar','game/assets/bar.png');
  		this.game.load.image('brick','game/assets/brick.png');
	}

	create() {
		this.game.plugins.lowrez.setTexture(this.game.cache.getImage('mosaic'));

		this.game.world.scale.setTo(config.scale,config.scale);

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		//this.game.physics.arcade.gravity.y = 100;

		this.ball = new Ball(this.game,8,8,'ball');
		const bar = new Bar(this.game, 16, 8, 'bar');
		const brick = new Brick(this.game, 64, 8, 'brick');
		this.game.stage.addChild(this.ball);	
		this.game.stage.addChild(bar);	
		this.game.stage.addChild(brick);	
	}

	update() { 
		
	}

	render(){
		this.game.plugins.lowrez.postRender();
	}

}
