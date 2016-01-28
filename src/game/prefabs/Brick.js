export default class Brick extends Phaser.Sprite {

	constructor(game,x,y,asset){
		super(game,x,y,asset);
		this.game.physics.enable(this,Phaser.Physics.ARCADE);
		this.body.immovable = true;
	}

}