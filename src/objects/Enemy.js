import { playPositionEffect } from "../utils/effects/EffectPlay";
import Stone from "./Stone";

export default class Enemy extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setImmovable(true);
        this.setScale(0);
        // 적의 체력
        this.health = 30;

        // 타이머 이벤트
        this.shootTimer = this.scene.time.addEvent({
            delay: 2000,
            callback: this.shoot,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        //추가적인 업데이트 코드
        if(this.y > this.scene.scale.height) {
            this.destroy();
        } else if(this.x < 0 || this.x > this.scene.scale.width) {
            this.destroy();
        }
    }

    //미사일과 충돌 시 실행되는 함수
    hit() {
        this.body.setVelocity(0, 0);
        //충돌 시 처리 코드
        this.health -= 10;
        // 피격 사운드
        this.scene.sound.play("impact2");
        this.hitEffect();
        if(this.health <= 0) {
            playPositionEffect(this.scene, this.x, this.y, "enemyDestory");
            this.scene.sound.play("explosion");
            this.destroy();
        }
    }

    hitEffect(){
        // 반짝임 처리
        this.setTintFill(0xf9f9f9);
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.clearTint();
            },
            callbackScope: this
        });
    }

    shoot() {
        const stone = new Stone(this.scene, this.x, this.y + 20, "stone");
        this.scene.stones.add(stone);

        // 플레이어 방향으로 총알 발사
        const player = this.scene.airplane; // 플레이어 객체 참조
        if (player) {
            this.scene.physics.moveToObject(stone, player, 300); // 속도 200으로 플레이어를 향해 이동
        }
    }

    //파괴될 때 실행되는 함수
    destroy() {
        // 타이머 이벤트 제거
        if (this.shootTimer) {
            this.shootTimer.remove(false);
        }
        this.scene.onEnemyDestroyed();
        super.destroy();
    }
}