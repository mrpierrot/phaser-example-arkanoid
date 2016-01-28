export default class Ball extends Phaser.Sprite {

	constructor(game,x,y,asset){
		super(game,x,y,asset);
		//this.anchor.set(0.5);
		this.checkWorldBounds = true;
		this.cacheAsBitmap = null;
		//this.scale.set(3);
		this.game.physics.enable(this,Phaser.Physics.ARCADE);
    	this.body.collideWorldBounds = true;
    	this.body.bounce.set(1);

    	this.speed = 200;

    	//this.launch(-45/180*Math.PI);

    	
	}

	postUpdate(){
		super.postUpdate();
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
	}


	launch(angle){
		this.body.velocity.setTo(
			Math.cos(angle) * this.speed,
			Math.sin(angle) * this.speed
		);

	}

}