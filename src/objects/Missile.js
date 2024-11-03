import Phaser from "phaser";

export default class Missile extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "missile");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(0.7);
    this.setCollideWorldBounds(true);
    this.setVelocityY(-300); // 미사일이 위로 날아가도록 설정
  }

  update() {
    if (this.y < 0) {
        this.destroy();
    }
  }
}
