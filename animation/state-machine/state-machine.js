import Scene from './src/Scene.js';

const config = {
    type: Phaser.AUTO,
    width: 40,
    height: 40,
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