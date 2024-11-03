export function handleInput(airplane, cursors, pointer, curserKeys, time, scene) {
  airplane.update(cursors, pointer, curserKeys);

  if (time > scene.lastFired) {
    const missile = scene.missiles.get(airplane.x, airplane.y - 20);
    if (missile) {
      missile.setActive(true);
      missile.setVisible(true);
      missile.setVelocityY(-600);
      scene.sound.play("singleshot", { volume: 0.3, rate : 1});
      scene.lastFired = time + 200;
    }
  }
}
