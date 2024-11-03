// 오브젝트에 붙는 이펙트 재생
export function playAttachedEffect(scene, obj, effectName = "defaultEffect", scale = 1){
  const effect = scene.add.sprite(obj.x, obj.y, effectName).setScale(scale);

  effect.play(effectName);

  const updatePosition = () => {
    effect.setPosition(obj.x, obj.y);
  }

  effect.on('animationcomplete', () => {
    effect.destroy(); // 애니메이션 완료 후 스프라이트 제거
    scene.events.off('update', updatePosition); // update 이벤트 리스너 제거
  });

  scene.events.on('update', updatePosition);
}

// 좌표 기반 이펙트 재생
export function playPositionEffect(scene, x, y, effectName = "defaultEffect", scale = 1){
  const effect = scene.add.sprite(x, y, effectName).setScale(scale);

  effect.play(effectName);

  effect.on("animationcomplete", () => {
    effect.destroy(); // 애니메이션 완료 후 스프라이트 제거
  });

  return effect;
}

