export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this.createAnimations();

        this.speed = 50;

        // Add this sprite to the scene
        scene.sys.updateList.add(this);
        scene.sys.displayList.add(this);

        // Add this to the physics group
        scene.physics.world.enableBody(this, 0);

        // Make sure player can't leave the game world
        this.setCollideWorldBounds(true);

        // Create cursor keys for movement
        this.cursors = scene.input.keyboard.createCursorKeys();

        // Create keys for triggering attack and changing attack type
        this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.nextAttackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.previousAttackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

        // Define player's state
        this.state = "IDLE";

        // Define array of attack types
        this.attackTypes = ["ATTACKING", "DIGGING", "CRYING"];

        // Define current attack type index
        this.currentAttackIndex = 0;

        this.on('animationcomplete', this.animComplete, this);
    }

    // New method to handle animation completion
    animComplete(animation, frame) {
        // If the animation that just finished is one of the action animations, return to the IDLE state
        if (this.attackTypes.includes(animation.key.toUpperCase())) {
            this.setState("IDLE");
        }
    }

    // Method to change state
    setState(newState) {
        this.state = newState;

        // Stop any existing animation and start new animation
        this.anims.stop();
        this.anims.play(newState.toLowerCase(), true);

        // Perform specific actions for each state
        switch (newState) {
            case 'ATTACKING':
                // Make the player bigger when attacking
                this.setScale(1.5);
                break;
            default:
                // Reset the player's scale when not attacking
                this.setScale(1);
                break;
        }
    }

    // Method to change attack type
    changeAttackType(next = true) {
        if (next) {
            this.currentAttackIndex = (this.currentAttackIndex + 1) % this.attackTypes.length;
        } else {
            this.currentAttackIndex--;
            if (this.currentAttackIndex < 0) {
                this.currentAttackIndex = this.attackTypes.length - 1;
            }
        }

        // Output current attack type for debugging
        console.log("Current attack type:", this.attackTypes[this.currentAttackIndex]);
    }

    update() {
        // Reset player velocity
        this.setVelocity(0);

        // Determine which keys are being pressed
        let movingLeft = this.cursors.left.isDown;
        let movingRight = this.cursors.right.isDown;
        let movingUp = this.cursors.up.isDown;
        let movingDown = this.cursors.down.isDown;
        let isMoving = movingLeft || movingRight || movingUp || movingDown;
        let isAttacking = this.attackKey.isDown;

        // If player is not currently performing an action, they can move or start a new action
        if (this.state === "IDLE" || this.state === "RUNNING") {
            if (isMoving) {
                // Update player state to running
                this.setState("RUNNING");

                // Calculate the player's new velocity
                if (movingLeft) {
                    this.flipX = false;
                    this.setVelocityX(-this.speed);
                } else if (movingRight) {
                    this.flipX = true;
                    this.setVelocityX(this.speed);
                }

                if (movingUp) {
                    this.setVelocityY(-this.speed);
                } else if (movingDown) {
                    this.setVelocityY(this.speed);
                }

                // Normalize and scale the velocity so that player can't move faster along a diagonal
                let velocity = new Phaser.Math.Vector2(this.body.velocity);
                if (velocity.length() > this.speed) {
                    velocity.normalize().scale(this.speed);
                    this.setVelocity(velocity.x, velocity.y);
                }
            } else {
                // If player is not moving, update player state to idle
                this.setState("IDLE");
            }

            // If attack key is pressed, switch to appropriate attack state
            if (isAttacking && this.state !== this.attackTypes[this.currentAttackIndex]) {
                this.setState(this.attackTypes[this.currentAttackIndex]);
            }

            // If next attack key is pressed, cycle to next attack type
            if (Phaser.Input.Keyboard.JustDown(this.nextAttackKey)) {
                this.changeAttackType(true);
            }

            // If previous attack key is pressed, cycle to previous attack type
            if (Phaser.Input.Keyboard.JustDown(this.previousAttackKey)) {
                this.changeAttackType(false);
            }
        }
    }


    createAnimations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNames('playerSprite', {
                prefix: 'idle-',
                start: 0,
                end: 0,
                zeroPad: 0, // If you have frame numbers with leading zeros
                suffix: '' // The extension of your frame images
            }),
            frameRate: 5,
            repeat: -1 // -1 for infinite loop, or the desired number of repeats
        });

        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNames('playerSprite', {
                prefix: 'run-',
                start: 0,
                end: 1,
                zeroPad: 0, // If you have frame numbers with leading zeros
                suffix: '' // The extension of your frame images
            }),
            frameRate: 5,
            repeat: -1 // -1 for infinite loop, or the desired number of repeats
        });

        this.anims.create({
            key: 'digging',
            frames: this.anims.generateFrameNames('playerSprite', {
                prefix: 'dig-',
                start: 0,
                end: 1,
                zeroPad: 0, // If you have frame numbers with leading zeros
                suffix: '' // The extension of your frame images
            }),
            frameRate: 5,
            repeat: 1 // -1 for infinite loop, or the desired number of repeats
        });

        this.anims.create({
            key: 'attacking',
            frames: this.anims.generateFrameNames('playerSprite', {
                prefix: 'attack-',
                start: 0,
                end: 1,
                zeroPad: 0, // If you have frame numbers with leading zeros
                suffix: '' // The extension of your frame images
            }),
            frameRate: 5,
            repeat: 1 // -1 for infinite loop, or the desired number of repeats
        });

        this.anims.create({
            key: 'crying',
            frames: this.anims.generateFrameNames('playerSprite', {
                prefix: 'cry-',
                start: 0,
                end: 1,
                zeroPad: 0, // If you have frame numbers with leading zeros
                suffix: '' // The extension of your frame images
            }),
            frameRate: 5,
            repeat: 1 // -1 for infinite loop, or the desired number of repeats
        });
    }
}
