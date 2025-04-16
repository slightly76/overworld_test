import Phaser from "phaser";
import Player from "../src/player.js";

export default class farmScene extends Phaser.Scene {
  constructor() {
    super("farmScene");
  }

  preload() {
    this.load.tilemapTiledJSON("theFarmMap", "assets/theFarmMap.json");
    this.load.image("theFarmMap", "assets/theFarmMap.png");
    this.load.spritesheet("playerSheet", "assets/dummy.png", {
      frameWidth: 32,
      frameHeight: 61,
    });
  }

  create() {
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // FRONT DOOR to firstFloor
    this.frontDoorTrigger = this.physics.add.sprite(190, 270, null);
    this.frontDoorTrigger.setSize(60, 30);
    this.frontDoorTrigger.setVisible(false);
    this.frontDoorTriggered = false;

    // PATH to overWorldMap
    this.toOverworldTrigger = this.physics.add.sprite(660, 530, null);
    this.toOverworldTrigger.setSize(60, 100);
    this.toOverworldTrigger.setVisible(false);
    this.toOverworldTriggered = false;

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    const map = this.make.tilemap({ key: "theFarmMap" });
    const tileset = map.addTilesetImage("theFarmMap", "theFarmMap");
    const mapLayer = map.createLayer("Tile Layer 1", tileset, -250, -50);
    mapLayer.setCollisionByProperty({ collide: true });
    mapLayer.setScale(0.6);

    this.player = new Player(this, 190, 270, "playerSheet");
    this.physics.add.collider(this.player, mapLayer);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.input.keyboard.enabled = true;
  }

  update() {
    this.player.update();

    const playerBounds = new Phaser.Geom.Rectangle(
      this.player.x - this.player.width / 2,
      this.player.y - this.player.height / 2,
      this.player.width,
      this.player.height
    );

    //FRONT DOOR requires space key
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        playerBounds,
        this.frontDoorTrigger.getBounds()
      ) &&
      Phaser.Input.Keyboard.JustDown(this.spaceKey)
    ) {
      this.moveScene("firstFloor");
    }

    //PATH to overworldmap requires space key
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        playerBounds,
        this.toOverworldTrigger.getBounds()
      ) &&
      Phaser.Input.Keyboard.JustDown(this.spaceKey)
    ) {
      this.moveScene("overworldScene");
    }
  }

  moveScene(sceneKey) {
    this.input.keyboard.enabled = false;
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.time.delayedCall(1000, () => {
      this.scene.start(sceneKey);
    });
  }
}
