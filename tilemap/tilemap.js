import Scene from './src/Scene.js';

const config = {
    type: Phaser.AUTO,
    width: 19 * 8,
    height: 16 * 8,
    backgroundColor: '#4488aa',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: Scene
};

const game = new Phaser.Game(config);