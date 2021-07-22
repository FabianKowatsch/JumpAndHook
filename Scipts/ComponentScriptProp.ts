namespace JumpandHook {
  import f = FudgeCore;
  export class ComponentScriptProp extends f.ComponentScript {
    private static audio: f.Audio = new f.Audio("../../L06_PuzzleGame/Assets/Sound/impact.mp3");
    public name: string = "CmpScriptProp";
    public cmpRigid: f.ComponentRigidbody;
    private cmpAudio: f.ComponentAudio;
    constructor() {
      super();
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndComponentAdd);
    }

    protected hndComponentAdd = (): void => {
      //Audio
      this.cmpAudio = new f.ComponentAudio(ComponentScriptProp.audio, false, false);
      this.getContainer().addComponent(this.cmpAudio);
      this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_OUTER_ANGLE, 360);
      this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_INNER_ANGLE, 360);
      this.getContainer().getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.onCollision);
    };

    private onCollision = (_event: f.EventPhysics): void => {
      let parent: f.Node = this.getContainer();
      if (_event.cmpRigidbody != parent.getAncestor().getChildrenByName("Avatar")[0].getComponent(f.ComponentRigidbody)) parent.getComponent(f.ComponentAudio).play(true);
    };
  }
}
