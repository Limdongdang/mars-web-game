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
  }
};

function startGame() {
  // 버튼 숨기기 및 게임 화면 보이기
  document.getElementById("start-button").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  // 이전 게임이 있으면 제거
  if (game) {
    game.destroy(true);
  }

  // 새로운 게임 생성
  game = new Phaser.Game(config);
}

// 게임 종료 후 다시 버튼을 보여주는 함수
function showStartButton() {
  document.getElementById("start-button").style.display = "block";
  document.getElementById("game-container").style.display = "none";
}

// 게임 시작 버튼 클릭 시 게임 실행
document.getElementById("start-button").addEventListener("click", startGame);

// 게임 오버 후에 다시 게임 시작 버튼을 표시할 수 있게
window.showStartButton = showStartButton;
