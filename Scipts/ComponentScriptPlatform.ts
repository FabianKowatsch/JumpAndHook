namespace JumpandHook {
  import f = FudgeCore;

  export enum EVENT_PLATFORM {
    BALL = "ballEnter"
  }
  export class ComponentScriptPlatform extends f.ComponentScript {
    private static materialId: string = "Material|2021-04-27T14:36:49.332Z|73063";
    private static meshId: string = "MeshCube|2021-04-27T14:35:44.543Z|88040";
    private static translationFactor: number = 28;
    public name: string = "CmpScriptPlatform";
    public index: number;
    private timeLoss: number;
    private timeStart: number;
    private mesh: f.Mesh;
    private material: f.Material;
    private node: f.Node;
    private triggerNode: f.Node;
    private trapNode: f.Node;
    private deathNode: f.Node;
    private isFirst: boolean;
    private allowNextPlatform: boolean = true;
    private isCompleted: boolean = false;
    constructor(_index: number, _isFirst: boolean, _timeStart: number, _timeLoss: number) {
      super();
      this.mesh = <f.Mesh>f.Project.resources[ComponentScriptPlatform.meshId];
      this.material = <f.Material>f.Project.resources[ComponentScriptPlatform.materialId];
      this.index = _index;
      this.isFirst = _isFirst;
      this.timeLoss = _timeLoss;
      this.timeStart = _timeStart;

      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndAdd);
      setTimeout(() => {
        f.Physics.adjustTransforms(this.node.getParent(), true);
      });
    }

    private hndAdd = (_event: f.Eventƒ) => {
      this.node = this.getContainer();
      if (!this.isFirst) {
        let transform: f.Matrix4x4 = new f.Matrix4x4();
        transform.translate(new f.Vector3(ComponentScriptPlatform.translationFactor * this.index, Math.random() * 4 - 2, Math.random() * 4 - 2));
        transform.rotate(new f.Vector3(0, (Math.random() - 0.5) * 20, 0));
        this.node.addComponent(new f.ComponentTransform(transform));
        this.node.addComponent(new f.ComponentMaterial(new f.Material("MaterialPlatform", f.ShaderFlat, new f.CoatColored(f.Color.CSS("white")))));
        let mesh: f.ComponentMesh = new f.ComponentMesh(this.mesh);
        mesh.mtxPivot.scale(new f.Vector3(15, 1, 10));
        this.node.addComponent(mesh);
        this.addNextNode();
        let cmpRigid: f.ComponentRigidbody = new f.ComponentRigidbody(100, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
        cmpRigid.restitution = 0;
        cmpRigid.friction = 10;
        this.node.addComponent(cmpRigid);
        this.addObstacleOrTrap();
      }
      this.addNextTrigger();

      this.addDeathTrigger();
      f.Physics.adjustTransforms(this.node.getParent(), true);
      let timeout: number = this.timeStart - this.index * this.timeLoss;
      let timeLeft: number = timeout;
      setInterval(() => {
        if (!this.isCompleted && timeLeft > 0) {
          timeLeft = timeLeft - 100;
          uiLive.time = timeLeft / 1000;
        }
        // tslint:disable-next-line: align
      }, 100);
      setTimeout(() => {
        this.sinkPlatform();
        // tslint:disable-next-line: align
      }, timeout);
    };

    private addNextNode(): void {
      let child: f.Node = new f.Node("next" + this.index);
      let transformChild: f.Matrix4x4 = new f.Matrix4x4();
      transformChild.translate(new f.Vector3(ComponentScriptPlatform.translationFactor / 2, 10, 0));
      transformChild.scale(new f.Vector3(2, 2, 2));
      child.addComponent(new f.ComponentTransform(transformChild));
      child.addComponent(new f.ComponentMesh(this.mesh));
      child.addComponent(new f.ComponentMaterial(this.material));
      child.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
      this.node.addChild(child);
    }

    private addNextTrigger(): void {
      this.triggerNode = new f.Node("NextTrigger" + this.index.toString());
      let cmpRigid: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
      this.triggerNode.addComponent(cmpRigid);
      this.triggerNode.addComponent(new f.ComponentTransform());
      this.triggerNode.mtxLocal.scale(new f.Vector3(4, 4, 10));
      this.triggerNode.mtxLocal.translate(new f.Vector3(1.5, 0, 0));
      this.node.appendChild(this.triggerNode);
      f.Physics.adjustTransforms(this.node.getAncestor(), true);
      cmpRigid.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.spawnNextPlatform);
    }

    private addDeathTrigger(): void {
      this.deathNode = new f.Node("DeathTrigger");
      let cmpRigid: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
      this.deathNode.addComponent(cmpRigid);
      this.deathNode.addComponent(new f.ComponentTransform());
      this.deathNode.mtxLocal.scale(new f.Vector3(100, 1, 100));
      this.deathNode.mtxLocal.translate(new f.Vector3(0, -20, 0));
      this.node.appendChild(this.deathNode);
      f.Physics.adjustTransforms(this.node.getAncestor(), true);
      cmpRigid.addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, this.setGameOverState);
    }

    private addObstacleOrTrap(): void {
      this.trapNode = new f.Node("trap" + this.index);
      this.node.addChild(this.trapNode);
      let randomNumber: number = Math.round(Math.random() * 4);

      switch (randomNumber) {
        case 0:
          let cmpScriptObstacle: ComponentScriptObstacle = new ComponentScriptObstacle();
          this.trapNode.addComponent(cmpScriptObstacle);
          break;
        case 1:
          let cmpScriptTrap: ComponentScriptTrap = new ComponentScriptTrap();
          this.trapNode.addComponent(cmpScriptTrap);
          break;
        case 3:
          this.allowNextPlatform = false;
          let cmpScriptBallGame: ComponentScriptBallGame = new ComponentScriptBallGame();
          this.trapNode.addComponent(cmpScriptBallGame);
          cmpScriptBallGame.addEventListener(EVENT_PLATFORM.BALL, () => {
            this.allowNextPlatform = true;
          });
          break;
        case 4:
          let cmpScriptProps: ComponentScriptGeneratedProps = new ComponentScriptGeneratedProps();
          this.trapNode.addComponent(cmpScriptProps);
          break;
        default:
          let cmpScriptObstacle2: ComponentScriptObstacle = new ComponentScriptObstacle();
          this.trapNode.addComponent(cmpScriptObstacle2);
          break;
      }
    }

    private setGameOverState = (_event: f.EventPhysics) => {
      let enteredNode: f.Node = _event.cmpRigidbody.getContainer();
      if (_event.cmpRigidbody.physicsType != 1) {
        if (enteredNode.name === "Avatar") {
          game.state = GAMESTATE.MENU;
        } else {
          enteredNode.removeComponent(_event.cmpRigidbody);
          enteredNode.getAncestor().removeChild(enteredNode);
        }
      }
    };

    private sinkPlatform(): void {
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.lower);
      if (this.trapNode) {
        this.trapNode.activate(false);
        this.trapNode.getChildren().forEach((child) => {
          if (child.getComponent(f.ComponentRigidbody)) child.removeComponent(child.getComponent(f.ComponentRigidbody));
        });
      }
    }
    private lower = (): void => {
      let rigid: f.ComponentRigidbody = this.node.getComponent(f.ComponentRigidbody);
      rigid.translateBody(new f.Vector3(0, -1, 0));
      if (rigid.getPosition().y <= -70) {
        f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.lower);
      }
    };

    private spawnNextPlatform = (_event: f.EventPhysics) => {
      if (_event.cmpRigidbody.physicsType != 1 && _event.cmpRigidbody.getContainer().name === "Avatar" && this.allowNextPlatform) {
        this.isCompleted = true;
        let nextPlatform: f.Node = new f.Node("platform" + this.index + 1);
        this.node.getParent().addChild(nextPlatform);
        nextPlatform.addComponent(new ComponentScriptPlatform(this.index + 1, false, this.timeStart, this.timeLoss));
        let trigger: f.ComponentRigidbody = this.triggerNode.getComponent(f.ComponentRigidbody);
        trigger.removeEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.spawnNextPlatform);
        this.triggerNode.removeComponent(trigger);
        game.solvedPlatforms++;
        uiLive.score = game.solvedPlatforms;
      }
    };
  }
}
