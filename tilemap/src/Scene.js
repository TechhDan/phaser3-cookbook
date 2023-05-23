export default class Scene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image("overworld", "assets/overworld.png");
        this.load.tilemapTiledJSON("map", "assets/island.json");
    }

    create() {
        const map = this.make.tilemap({ key: "map" });
        const tileset = map.addTilesetImage("overworld");
        const layer = map.createLayer("water", tileset, 0, 0);
        const grass = map.createLayer("grass", tileset, 0, 0);
    }

}
