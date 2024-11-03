import Phaser from "phaser";
import { playPositionEffect } from "../utils/effects/EffectPlay";

export default class Announcer extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y, textdata) {
    super(scene, x, y, "announcer");
    scene.add.existing(this);
    this.setScale(1);
    this.fullTexts = textdata;
    this.currentText = '';
    this.textIndex = 0;
    this.lineLength = 20; // 한 줄에 표시할 글자 수
    this.scene = scene;
    this.currentSentenceIndex = 0; // 현재 문장의 인덱스
    this.create();
  }

  create() {
    this.announcerFrame = this.scene.add.image(this.x, this.y, 'announcer_frame'); // 이미지 변수에 저장

    // 텍스트 객체 생성 및 폰트 적용
    this.text = this.scene.add.text(this.x + 32, this.y - 8, '', {
      fontFamily: 'NeoDGM',
      color: '#ffffff',
      wordWrap: { width: 300, useAdvancedWrap: true } // 텍스트가 잘리지 않도록 설정
    });

    // 타이머 이벤트를 사용하여 텍스트를 한 글자씩 추가
    this.textTimer = this.scene.time.addEvent({
      delay: 100, // 각 글자가 나타나는 시간 간격 (밀리초)
      callback: this.addCharacter,
      callbackScope: this,
      loop: true
    });

    this.effect = this.talking();
  }

  addCharacter() {
    if (this.currentSentenceIndex < this.fullTexts.length) {
      if (this.textIndex < this.fullTexts[this.currentSentenceIndex].length) {
        this.currentText += this.fullTexts[this.currentSentenceIndex][this.textIndex];
        this.text.setText(this.currentText);
        this.textIndex++;
      } else if (this.textIndex === this.fullTexts[this.currentSentenceIndex].length) {
        this.effect.destroy();
        this.currentSentenceIndex++;
        if (this.currentSentenceIndex < this.fullTexts.length) {
          // 다음 문장으로 넘어가기
          this.currentText = '';
          this.textIndex = 0;
          this.effect = this.talking();
        } else {
          // 모든 문장을 다 읽었을 때
          this.scene.time.addEvent({
            delay: 3000,
            callback: () => {
              this.text.destroy();
              this.effect.destroy();
              this.announcerFrame.destroy();
              this.destroy();
            },
          });
          this.textTimer.remove(false); // 타이머 이벤트 제거
        }
      }
    }
  }
  
  formatText(text) {
    const words = text.split(' ');
    let formattedText = '';
    let line = '';

    words.forEach(word => {
      if ((line + word).length > this.lineLength) {
        formattedText += line + '\n';
        line = '';
      }
      line += word + ' ';
    });

    formattedText += line.trim();
    return formattedText;
  }

  talking(){
    return playPositionEffect(this.scene, this.x, this.y, "announcer", 1);
  }
}
