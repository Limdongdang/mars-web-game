import Phaser from "phaser";

export function spawnStone() {
  const x = Phaser.Math.Between(50, this.scale.width - 50);
  const stone = this.stones.create(x, 0, "stone");
  stone.setVelocityY(200);
  stone.setCollideWorldBounds(false);
  stone.outOfBoundsKill = true;
  stone.setAngle(180);
}
