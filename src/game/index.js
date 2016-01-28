import Phaser from 'phaser';
import * as states from './states'; 
import {kebabCase} from 'lodash/string';
import {forEach} from 'lodash/collection';
import {name, version} from '../../package.json';
import config from './config.js';



console.log('%c'+name+' v'+version,'background: #222; color: #bada55;padding: 10px;');

const game = new Phaser.Game(config.width, config.height, Phaser.CANVAS, kebabCase(name), null ,false,true); 

forEach(states,(state, stateId) => game.state.add(stateId, state));

game.state.start('Game');