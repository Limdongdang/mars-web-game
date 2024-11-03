import Phaser from "phaser";
import { playPositionEffect } from "../utils/effects/EffectPlay";

export default class Announcer extends Phaser.Physics.Arcade.Image {
  constructor(scene, x, y) {
    super(scene, x, y, "announcer");
    scene.add.existing(this);
    this.setScale(1);
    this.fullText = '안녕하세요. 행성을 지키기 위해 미사일을 발사하세요.'; // Copilot 텍스트임 
    this.currentText = '';
    this.textIndex = 0;
    this.lineLength = 20; // 한 줄에 표시할 글자 수
    this.scene = scene;
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
    this.scene.time.addEvent({
      delay: 100, // 각 글자가 나타나는 시간 간격 (밀리초)
      callback: this.addCharacter,
      callbackScope: this,
      loop: true
    });

    this.effect = this.talking();
  }

  addCharacter() {
    if (this.textIndex < this.fullText.length) {
      this.currentText += this.fullText[this.textIndex];
      this.text.setText(this.currentText);
      this.textIndex++;
    } else if(this.textIndex == this.fullText.length){
      console.log("텍스트 출력 완료");
      this.effect.stop();
      // 텍스트 객체와 자신을 제거
      this.scene.time.addEvent({
        delay: 3000,
        callback: () => {
          this.text.destroy();
          this.effect.destroy();
          this.announcerFrame.destroy();
          this.destroy();
        },
      });
      this.textIndex++;
    }
  }

  destroyImage(){
    this.setAlpha(0);
    this.text.destroy();
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
