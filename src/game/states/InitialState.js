import config from '../config.js';

class InitialState extends Phaser.State {

	preload() {
  
	}

	create() {
		this.game.world.scale.setTo(config.scale,config.scale);
	}

	update() { 

	}

}

export default InitialState;