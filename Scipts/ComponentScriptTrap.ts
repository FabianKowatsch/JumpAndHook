namespace JumpandHook {
  import f = FudgeCore;

  export class ComponentScriptTrap extends f.ComponentScript {
    private static meshId: string = "MeshExtrusion|2021-07-22T15:37:50.445Z|19125";
    private static material: f.Material = new f.Material("MatTrap", f.ShaderFlat, new f.CoatColored(new f.Color(1, 1, 0, 1)));
    public name: string = "CmpScriptObstacle";
    public triggerRigid: f.ComponentRigidbody;
    private mesh: f.Mesh;
    private node: f.Node;
    private trap: f.Node;
    private trapRigid: f.ComponentRigidbody;
    constructor() {
      super();
      this.mesh = <f.Mesh>f.Project.resources[ComponentScriptTrap.meshId];
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndComponentAdd);
    }

    private hndComponentAdd = (): void => {
      this.node = this.getContainer();
      this.node.addComponent(new f.ComponentTransform());
      this.addObstacle();
    };

    private addObstacle = (): void => {
      this.trap = new f.Node("trap");
      let cmpTransform: f.ComponentTransform = new f.ComponentTransform();
      this.trap.addComponent(cmpTransform);
      this.trap.mtxLocal.scale(new f.Vector3(10, 4, 0.2));
      this.trap.mtxLocal.translate(new f.Vector3(0, 0.5, 0));
      this.trap.addComponent(new f.ComponentMaterial(ComponentScriptTrap.material));
      this.trap.addComponent(new f.ComponentMesh(this.mesh));
      this.trapRigid = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
      this.trap.addComponent(this.trapRigid);
      this.node.addChild(this.trap);
      f.Physics.adjustTransforms(this.node, true);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.rotate);
    };

    private rotate = (): void => {
      this.trapRigid.rotateBody(new f.Vector3(0, 5, 0));
    };
  }
}
