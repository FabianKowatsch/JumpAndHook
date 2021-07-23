namespace JumpandHook {
  import f = FudgeCore;

  export class ComponentScriptBallGame extends f.ComponentScript {
    private static audio: f.Audio = new f.Audio(Utils.path() + "../Assets/Sound/bell.mp3");
    private static mesh: f.Mesh = new f.MeshCube("MeshBasket");
    private static material: f.Material = new f.Material("MatBasket", f.ShaderFlat, new f.CoatColored(new f.Color(0, 1, 0, 1)));
    public name: string = "CmpScriptBasket";
    private triggerNode: f.Node;
    private node: f.Node;
    private ballRigid: f.ComponentRigidbody;
    private cmpAudio: f.ComponentAudio;
    constructor() {
      super();
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndComponentAdd);
    }

    private hndComponentAdd = (): void => {
      this.node = this.getContainer();
      this.node.addComponent(new f.ComponentTransform());
      this.addBasketBall();
    };

    private addBasketBall = (): void => {
      let randomNumber: number = Math.random();
      if (randomNumber > 0.5) randomNumber = 1;
      else randomNumber = -1;
      let lower: f.Node = this.createBasketPart("lower");
      lower.mtxLocal.translate(new f.Vector3(0, 2, 4 * randomNumber));
      lower.mtxLocal.scale(new f.Vector3(0.2, 5, 0.2));
      this.node.addChild(lower);
      let middle: f.Node = this.createBasketPart("middle");
      middle.mtxLocal.translate(new f.Vector3(0, 4.5, 4 * randomNumber));
      middle.mtxLocal.rotate(new f.Vector3(0, 0, 90));
      middle.mtxLocal.scale(new f.Vector3(0.2, 4, 0.2));
      this.node.addChild(middle);
      let right: f.Node = this.createBasketPart("right");
      right.mtxLocal.translate(new f.Vector3(2, 6, 4 * randomNumber));
      right.mtxLocal.scale(new f.Vector3(0.2, 3, 0.2));
      this.node.addChild(right);
      let left: f.Node = this.createBasketPart("left");
      left.mtxLocal.translate(new f.Vector3(-2, 6, 4 * randomNumber));
      left.mtxLocal.scale(new f.Vector3(0.2, 3, 0.2));
      this.node.addChild(left);
      //Audio
      this.cmpAudio = new f.ComponentAudio(ComponentScriptBallGame.audio, false, false);
      middle.addComponent(this.cmpAudio);
      this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_OUTER_ANGLE, 360);
      this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_INNER_ANGLE, 360);
      this.cmpAudio.volume = 1 * (uiMenu.volume / 100);
      //Ball
      let ball: f.Node = new f.Node("Ball");
      ball.addComponent(new f.ComponentTransform());
      ball.addComponent(new f.ComponentMaterial(new f.Material("BasketBall", f.ShaderFlat, new f.CoatColored(f.Color.CSS("orange")))));
      ball.addComponent(new f.ComponentMesh(new f.MeshSphere()));
      ball.mtxLocal.translate(new f.Vector3(0, 2, -4 * randomNumber));
      this.ballRigid = new f.ComponentRigidbody(8, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE, f.PHYSICS_GROUP.DEFAULT);
      ball.addComponent(this.ballRigid);
      ball.addComponent(new ComponentScriptProp());
      this.node.addChild(ball);
      f.Physics.adjustTransforms(this.node, true);
      this.addTrigger(randomNumber);
    };

    private createBasketPart = (_name: string) => {
      let node: f.Node = new f.Node(_name);
      let cmpMesh: f.ComponentMesh = new f.ComponentMesh(ComponentScriptBallGame.mesh);
      let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(ComponentScriptBallGame.material);
      let cmpTransform: f.ComponentTransform = new f.ComponentTransform();
      let cmpRigidbody: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
      node.addComponent(cmpMesh);
      node.addComponent(cmpMaterial);
      node.addComponent(cmpTransform);
      node.addComponent(cmpRigidbody);
      return node;
    };

    private addTrigger(_position: number): void {
      this.triggerNode = new f.Node("BasketTrigger");
      let cmpRigid: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
      this.triggerNode.addComponent(cmpRigid);
      this.triggerNode.addComponent(new f.ComponentTransform());
      this.triggerNode.mtxLocal.translate(new f.Vector3(0, 6, 4 * _position));
      this.triggerNode.mtxLocal.scale(new f.Vector3(4, 3, 0.5));
      this.node.appendChild(this.triggerNode);
      f.Physics.adjustTransforms(this.node.getAncestor(), true);
      cmpRigid.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.hndTriggerEnter);
    }

    private hndTriggerEnter = (_event: f.EventPhysics) => {
      if (_event.cmpRigidbody == this.ballRigid) {
        this.dispatchEvent(new Event(EVENT_PLATFORM.BALL));
        this.cmpAudio.play(true);
      }
    };
  }
}
