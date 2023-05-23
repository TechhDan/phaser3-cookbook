import Player from './Player.js';

export default class Scene extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.atlas('playerSprite', 'assets/Player.png', 'assets/Player.json');
    }

    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player = new Player(this, 16, 16, 'playerSprite', 'idle-0');
    }

    update() {
        this.player.update(this.cursors);
    }
}
