import Phaser from "phaser";
import Player from "../src/player.js";

export default class overworldScene extends Phaser.Scene {
  constructor() {
    super("overworldScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "../assets/overworld.JSON");
    this.load.image("mapImage", "../assets/1_Terrains_32x32.png");
    this.load.spritesheet("playerSheet", "../assets/dummy.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.cameras.main.fadeIn(1000, 0, 0, 0);

    const map = this.make.tilemap({ key: "map" });
    const tilesets = map.addTilesetImage("1_Terrains_32x32", "mapImage");
    const mapLayer = map.createLayer("grass", tilesets, 0, 0);
    mapLayer.setCollisionByProperty({ collide: true });
    this.locationLayer = map.createLayer("locations", tilesets, 0, 0);
    this.locationLayer.setCollisionByProperty({ collide: true });

    //create hidden trigger sprite for doors etc
    this.farmSceneTrigger = this.physics.add.sprite(272, 240, null);
    this.farmSceneTrigger.setSize(42, 42);
    this.farmSceneTrigger.setVisible(false);
    this.farmSceneTriggered = false;

    this.sceneTriggers = [
      { name: "farmScene", x: 272, y: 240 },
      { name: "officeScene", x: 300, y: 320 },
      { name: "battleScene", x: 120, y: 420 },
      //ADVANCED TODO: TECH DUNGEON
      // { name: "techDungeon", x: 120, y: 420 },
    ];

    this.triggers = this.sceneTriggers.map((trigger) => {
      const zone = this.physics.add.sprite(trigger.x, trigger.y, null);
      zone.setSize(42, 42);
      zone.setVisible(false);
      zone.sceneName = trigger.name;
      return zone;
    });

    //create player and add collision rules
    this.player = new Player(this, 250, 300, "playerSheet");
    this.physics.add.collider(this.player, mapLayer);
  }

  moveScene(sceneName) {
    this.input.keyboard.enabled = false;
    this.cameras.main.fadeOut(1000, 0, 0, 0);
    this.time.delayedCall(1000, () => {
      this.scene.start(sceneName);
      this.input.keyboard.enabled = true;
    });
  }

  update() {
    this.player.update();

    const playerBounds = new Phaser.Geom.Rectangle(
      this.player.x - this.player.width / 2 + 24,
      this.player.y - this.player.height / 2 + 38,
      15,
      8
    );

    this.triggers.forEach((trigger) => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          playerBounds,
          trigger.getBounds()
        ) &&
        Phaser.Input.Keyboard.JustDown(this.spaceKey)
      ) {
        this.moveScene(trigger.sceneName);
      }
    });
  }
}
