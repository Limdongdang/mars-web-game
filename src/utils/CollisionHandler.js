import {
  playAttachedEffect,
  playPositionEffect,
} from "./effects/EffectPlay";

export function handleCollision(type, obj1, obj2) {
  if (type === "airplane") {
    // obj1과 obj2 중 airplane과 다른 객체를 구분
    const spaceShip = obj1.name === "spaceShip" ? obj1 : obj2;
    const stone = obj1.name === "spaceShip" ? obj2 : obj1;
    
    stone.destroy(); // 미사일(stone) 제거
    this.lives -= 1;
    this.updateHearts(); // 체력 바 업데이트
    spaceShip.hitEffect(); // 피격시 
    // 무적시간 부여
    spaceShip.setInvincible(1000);
    if (this.lives <= 0) {
      this.physics.pause();
      spaceShip.setTint(0xff0000); // 비행기(obj1)를 빨간색으로 변경   

      // 게임 오버 후 다시 시작 버튼 표시
      setTimeout(() => {
        window.showStartButton();
      }, 2000);
    }
  } else if (type === "planet") {
    // obj1과 obj2 중 planet과 다른 객체를 구분
    console.log(obj1.texture.key, obj2.texture.key);
    const planet = obj1.texture.key === "planet" ? obj1 : obj2;
    const missile = obj1.texture.key === "planet" ? obj2 : obj1;

    planet.hitEffect(); // 피격시 하얗게 번쩍임

    missile.destroy();
    planet.reduceHealth(10, this);
  }
}
