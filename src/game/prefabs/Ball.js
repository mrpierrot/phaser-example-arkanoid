export default class Ball extends Phaser.Sprite {

	constructor(game,x,y,asset){
		super(game,x,y,asset);

		this.game.physics.enable(this, Phaser.Physics.ARCADE);
		this.anchor.setTo(0.5, 0.5);
    	this.body.collideWorldBounds = true;
    	this.body.bounce.setTo(1, 1);
    	this.body.allowGravity = true;  

    	this.launch();
	}


	launch(){

		const vx = 10;
		const vy = 10;
		this.body.velocity.setTo(vx, vy);

	}

}