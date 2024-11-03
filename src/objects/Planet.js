import Phaser from "phaser";

export default class Planet extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "planet");
    scene.add.existing(this);
    scene.physics.add.existing(this); // 물리 엔진에 추가
    this.setScale(0.5);
    this.health = 100;
    this.scene = scene;
  }

  update(){
    this.angle += 0.5;
    // 행성이 화면 밖으로 나가면 제거
    if (this.y > this.scene.scale.height) {
      this.destroy();
    }
  }

  reduceHealth(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.explode();
      this.destroy();
    }
  }

  // 피격시 하얗게 번쩍임
  hitEffect() {
    this.setTintFill(0xf9f9f9); // setTintFill 사용

    // 피격 사운드
    this.scene.sound.play("impact2");

    // 일정 시간 후에 원래 색상으로 되돌림
    this.scene.time.addEvent({
      delay: 100, // 100ms 후에 원래 색상으로 되돌림
      callback: () => {
        this.clearTint();
      },
      callbackScope: this
    });
  }

  explode() {
    this.scene.emitter.explode(48 ,this.x, this.y); // 파티클 위치를 행성의 위치로 설정
    this.scene.emitter2.setPosition(this.x, this.y); // 파티클 위치를 행성의 위치로 설정
    this.scene.emitter2.start(100, 300); // 파티클 재생
    this.scene.sound.play("explosion");
  }
}
