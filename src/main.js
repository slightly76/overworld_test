import Phaser from 'phaser';
import overworldScene from '../scenes/testScene.js';
import preloadScene from '../scenes/preloadScene.js';

export class mainScene extends Phaser.Scene {
	constructor() {
		super('mainScene');
	}
}

const config = {
	type: Phaser.AUTO,
	width: 1024,
	height: 576,
	backgroundColor: '#2d2d2d',
	scale: {
		// mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true,
		},
	},
	scene: [preloadScene, overworldScene],
};

const game = new Phaser.Game(config);
