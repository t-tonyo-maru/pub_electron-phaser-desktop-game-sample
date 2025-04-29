import Phaser from 'phaser';
import { MainScene } from './scenes/mainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: Math.min(window.innerHeight) * (16 / 9),
  height: Math.min(window.innerHeight),
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 200 }
    }
  },
  input: {
    gamepad: true
  },
  scene: MainScene
};

export const run = () => {
  new Phaser.Game(config);
};
