export function createAnimations(scene: Phaser.Scene): void {
    
  scene.anims.create({
    key: 'IDLE',
    frames: scene.anims.generateFrameNumbers('PLAYER_IDLE', { start: 0, end: 7 }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: 'MOVE',
    frames: scene.anims.generateFrameNumbers('PLAYER_MOVE', { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: 'ACT_PICKAXE',
    frames: scene.anims.generateFrameNumbers('PLAYER_PICKAXE', { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: 'ACT_AXE',
    frames: scene.anims.generateFrameNumbers('PLAYER_AXE', { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: 'TREE_IDLE',
    frames: scene.anims.generateFrameNumbers('TREE', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: 'TREE_CHOP',
    frames: scene.anims.generateFrameNumbers('TREE', { start: 4, end: 5 }),
    frameRate: 8,
    repeat: 0,
  });

  scene.anims.create({
    key: 'WATER_FOAM_ANIM',
    frames: scene.anims.generateFrameNumbers('WATER_FOAM', { start: 0, end: 16 }),
    frameRate: 8,
    repeat: -1,
  });

  scene.anims.create({
    key: 'ORE_IDLE',
    frames: scene.anims.generateFrameNumbers('ORE', { start: 0, end: 5 }),
    frameRate: 8,
    repeat: -1,
  });
}