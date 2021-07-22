namespace JumpandHook {
  import f = FudgeCore;
  export class Hook extends f.Node {
    private static audioPull: f.Audio = new f.Audio("../../L06_PuzzleGame/Assets/Sound/pull.mp3");
    private static audioPush: f.Audio = new f.Audio("../../L06_PuzzleGame/Assets/Sound/push.mp3");
    private static mesh: f.Mesh = new f.MeshCube("Gun");
    private static material: f.Material = new f.Material("MaterialGun", f.ShaderFlat, new f.CoatColored(f.Color.CSS("grey")));
    public cmpRigid: f.ComponentRigidbody;
    private grip: f.Node;
    private barrel: f.Node;
    private cmpAudioPush: f.ComponentAudio;
    private cmpAudioPull: f.ComponentAudio;
    constructor() {
      super("GravityGun");
      //Transform
      let cmpTransform: f.ComponentTransform = new f.ComponentTransform();
      cmpTransform.mtxLocal.scale(new f.Vector3(1, 1, 1));
      cmpTransform.mtxLocal.translate(new f.Vector3(0.6, -0.2, 0.35));
      cmpTransform.mtxLocal.rotate(new f.Vector3(0, 0, 0));
      this.addComponent(cmpTransform);

      //Barrel
      this.barrel = new f.Node("barrel");
      let barrelMesh: f.ComponentMesh = new f.ComponentMesh(Hook.mesh);
      this.barrel.addComponent(barrelMesh);
      let barrelMat: f.ComponentMaterial = new f.ComponentMaterial(Hook.material);
      this.barrel.addComponent(barrelMat);
      let barrelTr: f.ComponentTransform = new f.ComponentTransform();
      barrelTr.mtxLocal.scale(new f.Vector3(0.3, 0.05, 0.05));
      barrelTr.mtxLocal.translate(new f.Vector3(0, 0, 0));
      barrelTr.mtxLocal.rotate(new f.Vector3(0, 0, 0));
      this.barrel.addComponent(barrelTr);
      this.addChild(this.barrel);
      //Grip
      this.grip = new f.Node("grip");
      let gripMesh: f.ComponentMesh = new f.ComponentMesh(Hook.mesh);
      this.grip.addComponent(gripMesh);
      let gripMat: f.ComponentMaterial = new f.ComponentMaterial(Hook.material);
      this.grip.addComponent(gripMat);
      let gripTr: f.ComponentTransform = new f.ComponentTransform();
      gripTr.mtxLocal.scale(new f.Vector3(0.05, 0.15, 0.05));
      gripTr.mtxLocal.translate(new f.Vector3(-1.8, -0.5, 0));
      gripTr.mtxLocal.rotate(new f.Vector3(0, 0, -5));
      this.grip.addComponent(gripTr);
      this.addChild(this.grip);
      //Audio
      let audioNodePush: f.Node = new f.Node("AudioPush");
      this.cmpAudioPush = new f.ComponentAudio(Hook.audioPush, false, false);
      audioNodePush.addComponent(this.cmpAudioPush);
      this.cmpAudioPush.setPanner(f.AUDIO_PANNER.CONE_OUTER_ANGLE, 360);
      this.cmpAudioPush.setPanner(f.AUDIO_PANNER.CONE_INNER_ANGLE, 360);
      this.addChild(audioNodePush);

      let audioNodePull: f.Node = new f.Node("AudioPull");
      this.cmpAudioPull = new f.ComponentAudio(Hook.audioPull, false, false);
      audioNodePull.addComponent(this.cmpAudioPull);
      this.cmpAudioPull.setPanner(f.AUDIO_PANNER.CONE_OUTER_ANGLE, 360);
      this.cmpAudioPull.setPanner(f.AUDIO_PANNER.CONE_INNER_ANGLE, 360);
      this.addChild(audioNodePull);
    }
    public useRope(_targetNode: f.Node): void {
      let rope: f.Node = new f.Node("Rope");
      let cmpScript: ComponentScriptRope = new ComponentScriptRope(_targetNode, 0.05);
      this.addChild(rope);
      rope.addComponent(cmpScript);
    }
    public playPushSound(): void {
      this.cmpAudioPush.play(true);
    }
    public playPullSound(): void {
      this.cmpAudioPull.play(true);
    }
  }
}
