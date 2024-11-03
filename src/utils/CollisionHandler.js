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
  } else if (type === "planet") {
    // obj1과 obj2 중 planet과 다른 객체를 구분
    const planet = obj1.texture.key === "planet" ? obj1 : obj2;
    const missile = obj1.texture.key === "planet" ? obj2 : obj1;

    planet.hitEffect(); // 피격시 하얗게 번쩍임

    missile.destroy();
    planet.reduceHealth(10, this);
  } else if (type === "enemy1") {
    const enemy = obj1.texture.key === "enemy1" ? obj1 : obj2;
    const missile = obj1.texture.key === "enemy1" ? obj2 : obj1;

    enemy.hit();
    missile.destroy();
  } else if(type === "boss") {
    const boss = obj1.texture.key === "boss" ? obj1 : obj2;
    const missile = obj1.texture.key === "boss" ? obj2 : obj1;

    boss.hit();
    missile.destroy();
  }
}
