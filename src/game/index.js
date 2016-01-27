import Phaser from 'phaser';
import InitialState from './states/InitialState'; 
import {kebabCase} from 'lodash/string';
import {name, version} from '../../package.json';
import config from './config.js';

console.log('%c'+name+' v'+version,'background: #222; color: #bada55;padding: 10px;');

var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, kebabCase(name), new InitialState(),false,false); 
