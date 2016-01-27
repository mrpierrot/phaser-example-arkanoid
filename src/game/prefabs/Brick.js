export default class Brick extends Phaser.Sprite {

	constructor(game,x,y,asset){
		console.log(game,x,y);
		super(game,x,y,asset);
	}

}