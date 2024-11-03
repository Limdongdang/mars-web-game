import { AudioData } from "./AudioData";

// Audio 로드 매니저
export const loadAudio = (scene) => {
    Object.values(AudioData).forEach(audio => {
        scene.load.audio(audio.name, audio.src);
    });
}
