//import PIXI from 'pixi.js';

import ColorMatrixFilter from 'phaser/filters/pixi/ColorMatrixFilter';
console.log(ColorMatrixFilter);

export default class Brick extends Phaser.Sprite {

	constructor(game,x,y,asset){
		super(game,x,y,asset);
		this.game.physics.enable(this,Phaser.Physics.ARCADE);
		this.body.immovable = true;
		
	}


	destruct(){
		this.events.onKilled.addOnce(this._onKillHandler,this);
		this.kill();
		/*let filter = new PIXI.ColorMatrixFilter();
		filter.matrix = [0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1];
		this.filter = [filter];*/
	}

	_onKillHandler(){
		console.log("onKilled",this.x,this.y);
		let emitter = this.game.add.emitter(0, 0, 100);
	    emitter.makeParticles('brick-dust');
	   //emitter.gravity = 100;
	    emitter.x = this.x+this.width*0.5;
	    emitter.y = this.y+this.height*0.5;
	    emitter.minParticleSpeed.setTo(-50, -50);
    	emitter.maxParticleSpeed.setTo(50, 50);
    	emitter.minParticleScale = 1;
    	emitter.maxParticleScale = 1.5;

	    emitter.start(true,300,null,10);
	  
	    this.game.time.events.add(2000,function(){
	    	emitter.destroy();	
	    });
	}

}