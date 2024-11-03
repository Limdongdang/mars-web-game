import { playPositionEffect } from "../utils/effects/EffectPlay";
import Stone from "./Stone";

export default class Boss extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
    this.setScale(0);

    this.setImmovable(true);
    this.health = 400;

    // 타이머 이벤트
    this.shootTimer = this.scene.time.addEvent({
      delay: 5000,
      callback: this.shoot,
      callbackScope: this,
      loop: true,
    });

    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      x: this.x,
      y: this.y,
      duration: 1000,
      ease: "Power1",
      onComplete: () => {
        this.scene.tweens.add({
          targets: this,
          x: { from: this.x, to: this.x + 200 },
          y: this.y,
          ease: "Linear",
          duration: 3000,
          yoyo: true,
          repeat: -1,
        });
      },
    });
    this.rotationOffset = 0; // 총알 방향을 조절하기 위한 각도 오프셋
  }

  update() {}

  //미사일과 충돌 시 실행되는 함수
  hit() {
    this.body.setVelocity(0, 0);
    //충돌 시 처리 코드
    this.health -= 10;
    // 피격 사운드
    this.scene.sound.play("impact2");
    this.hitEffect();
    if (this.health <= 0) {
      this.destroy();
    }
  }

  hitEffect() {
    // 반짝임 처리
    this.setTintFill(0xf9f9f9);
    this.scene.time.addEvent({
      delay: 100,
      callback: () => {
        this.clearTint();
      },
      callbackScope: this,
    });
  }

  shoot() {
    const numBullets = 24; // 발사할 총알의 개수
    const angleStep = (2 * Math.PI) / numBullets; // 각 총알 사이의 각도 간격
    const numWaves = 5; // 발사할 웨이브의 수
    const delayBetweenWaves = 500; // 각 웨이브 사이의 딜레이 (밀리초)

    for (let j = 0; j < numWaves; j++) {
      this.scene.time.addEvent({
        delay: j * delayBetweenWaves,
        callback: () => {
          // 방사형으로 총알 발사
          for (let i = 0; i < numBullets; i++) {
            const stone = new Stone(this.scene, this.x, this.y + 20, "stone");
            this.scene.stones.add(stone);
            const angle = i * angleStep + this.rotationOffset; // 각 총알의 각도 계산
            const velocityX = Math.cos(angle) * 160;
            const velocityY = Math.sin(angle) * 160;
            stone.setVelocity(velocityX, velocityY);
          }
          // 각도 오프셋을 증가시켜 다음 총알 발사 시 회전 효과를 줌
          this.rotationOffset += Phaser.Math.DegToRad(10); // 예: 10도씩 회전
        },
        callbackScope: this,
      });
    }
  }

  //파괴될 때 실행되는 함수
  destroy() {
    // 타이머 이벤트 제거
    if (this.shootTimer) {
      this.shootTimer.remove(false);
    }

    // 천천히 쓰러지는 애니메이션 추가
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      alpha: 0,
      angle: 90, // 회전 효과 추가
      duration: 2000,
      ease: "Power1",
      onComplete: () => {
        this.scene.emitter.explode(48, this.x, this.y);
        this.scene.emitter2.setPosition(this.x, this.y);
        this.scene.emitter2.start(100, 300);
        this.scene.onEnemyDestroyed();
        this.scene.sound.play("explosion");
        this.scene.gameClear();
        super.destroy();
      },
    });
  }
}
