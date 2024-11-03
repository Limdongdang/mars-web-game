// Stone.js
export default class Stone extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

    }

    update() {
        // 총알이 화면 밖으로 나가면 파괴
        if (this.y > this.scene.scale.height || this.y < 0 || this.x < 0 || this.x > this.scene.scale.width) {
            this.destroy();
        }
    }
}