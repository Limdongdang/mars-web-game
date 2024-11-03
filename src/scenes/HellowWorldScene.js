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

export default class HelloWorldScene extends Phaser.Scene {
  constructor() {
    super("hello-world");
    this.lastFired = 0;
    this.lives = 3;
    this.planetHealth = 100;
    this.emitter = null;
    this.emitter2 = null;
  }

  preload() {
    this.load.image("planet", "/src/assets/planet_09.png");
    this.load.image("space", "/src/assets/spaceBg.png");
    this.load.image("stone", "/src/assets/bomb.png");
    this.load.image("missile", "/src/assets/missile.png");
    this.load.image("heart", "/src/assets/heart.png");
    this.load.image("particle", "/src/assets/particle.png");
    this.load.image("particle2", "/src/assets/particle2.png");
    this.load.image("announcer_frame", "/src/assets/announcer_frame.png");
    
    loadAudio(this); // 모든 오디오 로드
    loadEffects(this); // 모든 이펙트 로드

    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
  }

  create() {
    this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, "space");
    this.background.setOrigin(0, 0);

    this.text = this.add.text(0, 0);

    createAnimations(this); // 모든 애니메이션 생성

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    var controller = this.plugins.get('rexvirtualjoystickplugin').addVectorToCursorKeys({
      dir: '8dir',
      forceMin: 16
    });

    var graphics = this.add.graphics();

    this.input
      .on('pointerup', function () {
          graphics.clear();
          controller.clearVector();
      })
      .on('pointermove', function (pointer) {
          graphics.clear();
          if (!pointer.isDown) {
              controller.clearVector();
              return;
          }

          controller.setVector(pointer.downX, pointer.downY, pointer.x, pointer.y);
          graphics.lineStyle(3, 0xff0000).lineBetween(pointer.downX, pointer.downY, pointer.x, pointer.y);
      });
    
    this.cursorKeys = controller.createCursorKeys();
    this.print = this.add.text(0, 0, '')

    this.airplane = new SpaceShip(this, centerX, this.scale.height - 100);
    this.missiles = this.physics.add.group({
      classType: Missile,
      maxSize: 20,
      runChildUpdate: true, // 각 미사일의 update 메서드가 호출되도록 설정
    });

    this.planets = this.physics.add.group({
      classType: Planet,
      maxSize: 3,
      runChildUpdate: true,
    });
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.shape = new Phaser.Geom.Ellipse(0, 0, 100, 100);
    this.announcer = new Announcer(this, 36, 100);

    this.emitter = this.add.particles(0, 0, 'particle', {
      lifespan: 1500,
      speed: { min: 50, max: 250 },
      scale: { start: 0.8, end: 0 },
      blendMode: 'ADD',
      emitting: false
    });

    const circle = new Phaser.Geom.Circle(0, 0, 40);
    this.emitter2 = this.add.particles(0, 0, 'particle2', {
      scale: { start: 1.5, end: 0 }, // 생성 시 크기
      alpha: { start: 1, end: 0 }, // 투명도
      // 개수 설정
      quantity: 1,
      emitZone: { source: circle },
      emitting: false
    });

    this.stones = this.physics.add.group();

    // 하트 이미지 생성
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      const heart = this.add.image(36 + i * 36, 30, "heart");
      heart.setAn
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

    this.time.addEvent({
      delay: 200,
      callback: spawnStone,
      callbackScope: this,
      loop: true,
    });

    // 10초 후 행성 생성
    this.time.addEvent({
      delay: 10000,
      callback: () => {
        this.createPlanet(centerX, -50, this.planetHealth);
      },
      callbackScope: this,
      loop: true,
    });
  }

  update(time) {
    var s = 'Key down: ';
        for (var name in this.cursorKeys) {
            if (this.cursorKeys[name].isDown) {
                s += `${name} `;
            }
        }

        this.print.setText(s);

    if(this.airplane.active){
      handleInput(this.airplane, this.cursors, this.input.pointer1, this.cursorKeys, time, this);
    }

    this.background.tilePositionY -= 1;
    if(this.lives == 0){
      // 모든 사운드 정지
      this.sound.stopAll();
    }
  }

  createPlanet(x, y) {
    const planet = this.planets.get();
    if (!planet) return;

    planet.setActive(true);
    planet.setVisible(true);
    planet.setPosition(x, y);
    planet.setImmovable(true);
    
    // 행성이 포물선을 그리며 내려오도록 설정
    this.tweens.add({
      targets: planet,
      ease: "power2",
      duration: 2000,
      x: Phaser.Math.Between(50, this.scale.width - 100),
      y: 100
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
}
