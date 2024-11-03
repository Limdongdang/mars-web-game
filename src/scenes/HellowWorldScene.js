import Phaser from "phaser";
import { spawnStone } from "../utils/SpawnStone";
import { handleInput } from "../utils/InputHandler";
import { handleCollision } from "../utils/CollisionHandler";
import { createAnimations, loadEffects } from "../utils/effects/EffectManager";
import SpaceShip from "../objects/SpaceShip";
import Missile from "../objects/Missile";
import Planet from "../objects/Planet";
import { loadAudio } from "../utils/audio/AudioManager";
import { playPositionEffect } from "../utils/effects/EffectPlay";
import Announcer from "../objects/Announcer";
import Enemy from "../objects/Enemy";
import Stone from "../objects/Stone";
import Boss from "../objects/Boss";

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
    this.lastFired = 0;
    this.lives = 3;
    this.planetHealth = 100;
    this.emitter = null;
    this.emitter2 = null;
    this.enemy1Count = 0;
    this.phaseCount = 0;
    this.phaseInProgress = 0;
  }

  preload() {
    this.load.image("planet", "/mars-web-game/assets/planet_09.png");
    this.load.image("space", "/mars-web-game/assets/spaceBg.png");
    this.load.image("stone", "/mars-web-game/assets/bomb.png");
    this.load.image("missile", "/mars-web-game/assets/missile.png");
    this.load.image("heart", "/mars-web-game/assets/heart.png");
    this.load.image("particle", "/mars-web-game/assets/particle.png");
    this.load.image("particle2", "/mars-web-game/assets/particle2.png");
    this.load.image(
      "announcer_frame",
      "/mars-web-game/assets/announcer_frame.png"
    );
    this.load.image("enemy1", "/mars-web-game/assets/enemy1.png");
    this.load.image("boss", "/mars-web-game/assets/boss.png");

    loadAudio(this); // 모든 오디오 로드
    loadEffects(this); // 모든 이펙트 로드

    this.load.plugin(
      "rexvirtualjoystickplugin",
      "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js",
      true
    );
  }

  create() {
    this.background = this.add.tileSprite(
      0,
      0,
      this.scale.width,
      this.scale.height,
      "space"
    );
    this.background.setOrigin(0, 0);

    createAnimations(this); // 모든 애니메이션 생성

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    var controller = this.plugins
      .get("rexvirtualjoystickplugin")
      .addVectorToCursorKeys({
        dir: "8dir",
        forceMin: 16,
      });

    this.input
      .on("pointerup", function () {
        controller.clearVector();
      })
      .on("pointermove", function (pointer) {
        if (!pointer.isDown) {
          controller.clearVector();
          return;
        }

        controller.setVector(
          pointer.downX,
          pointer.downY,
          pointer.x,
          pointer.y
        );
      });

    this.cursorKeys = controller.createCursorKeys();
    this.print = this.add.text(0, 0, "");

    this.airplane = new SpaceShip(this, centerX, this.scale.height - 100);
    this.missiles = this.physics.add.group({
      classType: Missile,
      maxSize: 2000,
      runChildUpdate: true, // 각 미사일의 update 메서드가 호출되도록 설정
    });

    this.planets = this.physics.add.group({
      classType: Planet,
      maxSize: 3,
      runChildUpdate: true,
    });

    this.enemy1Group = this.physics.add.group({
      classType: Enemy,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.stones = this.physics.add.group({
      classType: Stone,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.boss = this.physics.add.group({
      classType: Boss,
      maxSize: 1,
      runChildUpdate: true,
    });
    this.cursors = this.input.keyboard.createCursorKeys();

    this.shape = new Phaser.Geom.Ellipse(0, 0, 100, 100);

    const textdata = [
      "안녕하세요, 마스외전으로 가는 여정에 오신 것을 환영합니다.",
      " 저는 여러분의 안내자입니다. 마스외전으로 가는 길은 험난하지만 무사히 도착할 수 있을 겁니다.",
      " 행성의 위험을 피하고 마스외전으로 무사히 도착하길 바랍니다.",
    ];

    this.announcer = new Announcer(this, 36, 100, textdata);

    this.emitter = this.add.particles(0, 0, "particle", {
      lifespan: 1500,
      speed: { min: 50, max: 250 },
      scale: { start: 0.8, end: 0 },
      blendMode: "ADD",
      emitting: false,
    });

    const circle = new Phaser.Geom.Circle(0, 0, 40);
    this.emitter2 = this.add.particles(0, 0, "particle2", {
      scale: { start: 1.5, end: 0 }, // 생성 시 크기
      alpha: { start: 1, end: 0 }, // 투명도
      // 개수 설정
      quantity: 1,
      emitZone: { source: circle },
      emitting: false,
    });

    // 하트 이미지 생성
    this.hearts = [];
    for (let i = 0; i < this.lives; i++) {
      const heart = this.add.image(36 + i * 36, 30, "heart");
      heart.setAn;
      this.hearts.push(heart);
    }

    this.physics.add.collider(
      this.airplane,
      this.stones,
      handleCollision.bind(this, "airplane")
    );

    this.physics.add.collider(
      this.missiles,
      this.planets,
      handleCollision.bind(this, "planet")
    );

    this.physics.add.collider(
      this.enemy1Group,
      this.missiles,
      handleCollision.bind(this, "enemy1")
    );

    this.physics.add.collider(
      this.missiles,
      this.boss,
      handleCollision.bind(this, "boss")
    );

    // 5초 후 행성 생성
    this.planetEvent = this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.createPlanet();
      },
      callbackScope: this,
      loop: true,
    });
  }

  update(time) {
    if (this.airplane.active) {
      handleInput(
        this.airplane,
        this.cursors,
        this.input.pointer1,
        this.cursorKeys,
        time,
        this
      );
    }

    this.background.tilePositionY -= 1;
    if (this.lives == 0) {
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.scene.start("game-over");
        },
      });
    }

    if (this.announcer?.active) {
      // 행성이 떨어지는 이벤트 잠시 중지
      this.planetEvent.paused = true;
    } else if (this.phaseInProgress == 0 && this.phaseCount <= 2) {
      this.phase1();
    } else if (this.phaseInProgress == 0 && this.phaseCount == 3) {
      this.phaseCount++;
      const textdata = [
        "이제 거의 다 왔습니다 이제 마지막 적을 처치하고 마스로 가세요.",
      ];
      // 아나운서 생성
      this.announcer = new Announcer(this, 36, 100, textdata);
    } else if (this.phaseInProgress == 0 && this.phaseCount == 4) {
      this.phase2();
    } else {
      this.planetEvent.paused = false;
    }
  }

  createPlanet() {
    const planet = this.planets.get();
    if (!planet) return;

    const initx = Phaser.Math.Between(50, this.scale.width - 50);
    const inity = -100;

    planet.setActive(true);
    planet.setVisible(true);
    planet.setPosition(initx, inity);
    planet.setImmovable(true);

    // 행성이 랜덤한 속도 수직으로 아래로 이동
    this.tweens.add({
      targets: planet,
      y: this.scale.height + 100,
      duration: 10000,
      onComplete: () => {
        planet.destroy();
      },
    });
  }

  updateHearts() {
    for (let i = 0; i < this.hearts.length; i++) {
      if (i < this.lives) {
        this.hearts[i].setVisible(true);
      } else {
        this.blinkAndHideHeart(this.hearts[i]);
      }
    }
  }

  blinkAndHideHeart(heart) {
    const blinkDuration = 1000; // 깜박이는 총 시간 (밀리초)
    const blinkInterval = 100; // 깜박이는 간격 (밀리초)

    const blinkEvent = this.time.addEvent({
      delay: blinkInterval,
      callback: () => {
        heart.setVisible(!heart.visible);
      },
      repeat: blinkDuration / blinkInterval - 1,
    });

    // heart 삭제
    this.hearts.splice(this.hearts.indexOf(heart), 1);

    this.time.addEvent({
      delay: blinkDuration,
      callback: () => {
        heart.setVisible(false);
        blinkEvent.remove(false); // 깜박이는 이벤트 제거
      },
    });
  }

  phase1() {
    this.phaseCount++;
    this.phaseInProgress = 1;

    const startX = this.phaseCount % 2 === 0 ? this.scale.width - 50 : 50; // 짝수 페이즈에서는 반대쪽에서 시작
    const startY = 100;
    const spacing = 50; // 각 적 사이의 간격

    this.enemy1Count = 5;

    for (let i = 0; i < 5; i++) {
      const enemy1 = this.enemy1Group.get(
        startX,
        startY + i * spacing,
        "enemy1"
      );

      // 크기 조절 트윈 애니메이션
      this.tweens.add({
        targets: enemy1,
        scaleX: 1,
        scaleY: 1,
        duration: 1000,
        ease: "Power1",
        onComplete: () => {
          // 크기 조절이 완료된 후 좌우로 움직이는 트윈 애니메이션 설정
          this.tweens.add({
            targets: enemy1,
            x: this.phaseCount % 2 === 0 ? 50 : this.scale.width - 50, // 짝수 페이즈에서는 반대쪽으로 이동
            y: startY + i * spacing,
            duration: 2000,
            delay: i * 500, // 각 적이 조금씩 늦게 나오도록 딜레이 설정
            flipX: true,
            yoyo: true,
            repeat: -1, // 무한 반복
          });
        },
      });
    }
  }

  phase2() {
    this.phaseCount++;

    const boss = this.boss.get(this.scale.width / 2 - 100, 100, "boss");
  }

  onEnemyDestroyed() {
    this.enemy1Count--; // 적의 수 감소
    if (this.enemy1Count === 0) {
      this.phaseInProgress = 0;
    }
  }

  gameClear() {
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.scene.start("game-clear");
      },
    });
  }
}
