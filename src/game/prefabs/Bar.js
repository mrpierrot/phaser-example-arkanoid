export default class Bar extends Phaser.Sprite {

	constructor(game,x,y,asset){
		super(game,x,y,asset);
		//this.anchor.set(0.5);
		this.game.physics.enable(this,Phaser.Physics.ARCADE);
		this.body.immovable = true;
		this.body.collideWorldBounds = true;
	}

	postUpdate(){
		super.postUpdate();
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
	}

}