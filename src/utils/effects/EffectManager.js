import { EffectData } from "./EffectData";

// effect 로드 매니저
export const loadEffects = (scene) => {
    Object.values(EffectData).forEach(effect => {
        scene.load.spritesheet(effect.name, effect.src, {
          frameWidth: effect.frameWidth,
          frameHeight: effect.frameHeight,
        });
    });
}

// 애니메이션 생성 매니저
export const createAnimations = (scene) => {
  Object.values(EffectData).forEach(effect => {
    if (effect.animation) {
      scene.anims.create({
        key: effect.animation.key,
        frames: scene.anims.generateFrameNumbers(effect.name, {
          start: effect.animation.start,
          end: effect.animation.end,
        }),
        frameRate: effect.animation.frameRate,
        repeat: effect.animation.repeat,
      });
    }
  });
}