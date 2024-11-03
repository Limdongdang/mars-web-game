import Phaser from "phaser";
import HelloWorldScene from "./src/scenes/HellowWorldScene";
import GameClearScene from "./src/scenes/GameClearScene";
import GameOverScene from "./src/scenes/GameOverScene";

let game;

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [HelloWorldScene, GameClearScene, GameOverScene],
  parent: "game-container",
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },
};

game = new Phaser.Game(config);
