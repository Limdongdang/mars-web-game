import Phaser from "phaser";
import { loadAudio } from "../utils/audio/AudioManager";
const webUrl = import.meta.env.VITE_REACT_URL;

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: "game-over" });
  }

  preload() {
    // Load any assets needed for this scene
    loadAudio(this); // 모든 오디오 로드
  }

  create() {
    // 화면 크기 감지
    const { width, height } = this.scale;

    this.sound.play("fail");

    // 배경색 설정
    this.cameras.main.setBackgroundColor("#000000");

    // "축하드립니다" 텍스트 추가
    this.add
      .text(width / 2, height / 2, "이런! 실패하셨습니다!", {
        fontFamily: "NeoDGM",
        fontSize: `24px`, // 화면 크기에 따라 폰트 크기 조정
        color: "#f9f9f9",
      })
      .setOrigin(0.5, 0.5); // 텍스트의 중심을 기준으로 위치 설정

    // "축하드립니다" 텍스트 추가
    this.add
      .text(
        width / 2,
        height / 2 + 30,
        "괜찮습니다 바로 마스외전으로 가보시겠어요?",
        {
          fontFamily: "NeoDGM",
          fontSize: `20px`, // 화면 크기에 따라 폰트 크기 조정
          color: "#f9f9f9",
          // 글자 안 잘리게 하기 위해 wordWrap 설정
          wordWrap: { width: 300, useAdvancedWrap: true },
          // 글자 중앙 정렬
          align: "center",
        }
      )
      .setOrigin(0.5, 0.5); // 텍스트의 중심을 기준으로 위치 설정

    // 버튼 추가
    const button = this.add
      .text(width / 2, height / 2 + 70, "둘러보기", {
        fontFamily: "NeoDGM",
        fontSize: `16px`, // 화면 크기에 따라 폰트 크기 조정
        color: "#f9f9f9",
        backgroundColor: "#0000ff", // 버튼 배경색 추가
        padding: { x: 10, y: 5 }, // 버튼 패딩 추가
      })
      .setOrigin(0.5, 0.5) // 텍스트의 중심을 기준으로 위치 설정
      .setInteractive({ useHandCursor: true }) // 인터랙티브 속성 추가 및 커서 변경
      .on("pointerdown", () => {
        window.location.href = webUrl; // 클릭 시 URL로 이동
      })
      .on("pointerover", () => {
        button.setStyle({ fill: "#ff0" }); // 마우스 오버 시 텍스트 색상 변경
      })
      .on("pointerout", () => {
        button.setStyle({ fill: "#fff" }); // 마우스 아웃 시 텍스트 색상 복원
      });
  }
}
