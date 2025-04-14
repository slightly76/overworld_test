import Phaser from 'phaser';
import Player from '../src/player.js';

export default class overworldScene extends Phaser.Scene {
	constructor() {
		super('overworldScene');
	}

	preload() {
		this.load.tilemapTiledJSON('map', '../assets/overworld.JSON');
		this.load.image('mapImage', '../assets/1_Terrains_32x32.png');
		this.load.spritesheet('playerSheet', '../assets/farmer.png', {
			frameWidth: 64,
			frameHeight: 64,
		});
		this.load.audio('unacceptable', '../assets/unacceptable.mp3');
	}

	create() {
		//scene fades in
		this.cameras.main.fadeIn(1000, 0, 0, 0);

		// create map
		const map = this.make.tilemap({ key: 'map' });
		const tilesets = map.addTilesetImage('1_Terrains_32x32', 'mapImage');
		const mapLayer = map.createLayer('grass', tilesets, 0, 0);
		mapLayer.setCollisionByProperty({ collide: true });
		this.locationLayer = map.createLayer('locations', tilesets, 0, 0);
		this.locationLayer.setCollisionByProperty({ collide: true });

		//create hidden trigger sprite for doors etc
		this.doorTrigger = this.physics.add.sprite(272, 240, null);
		this.doorTrigger.setSize(42, 42);
		this.doorTrigger.setVisible(false);
		this.doorTriggered = false;

		//create player and add collision rules
		this.player = new Player(this, 250, 300, 'playerSheet');
		this.physics.add.collider(this.player, mapLayer);
	}

	update() {
		this.player.update();

		const playerBounds = new Phaser.Geom.Rectangle(
			this.player.x - this.player.width / 2 + 24,
			this.player.y - this.player.height / 2 + 38,
			15,
			8
		);
		//create doortrigger overlap rules
		const isOverlapping = Phaser.Geom.Intersects.RectangleToRectangle(
			playerBounds,
			this.doorTrigger.getBounds()
		);
		if (isOverlapping && !this.doorTriggered) {
			this.doorTriggered = true;
			console.log('UNACCEPTABLE OVERLAP!!!');

			this.sound.play('unacceptable');
			this.time.delayedCall(1000, () => {
				this.cameras.main.shake(1000, 0.01);
			});
		} else if (!isOverlapping && this.doorTriggered) {
			this.doorTriggered = false;
		}
	}
}
