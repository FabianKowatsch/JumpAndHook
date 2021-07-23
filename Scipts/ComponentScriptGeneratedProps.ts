namespace JumpandHook {
  import f = FudgeCore;

  export class ComponentScriptGeneratedProps extends f.ComponentScript {
    private static mesh: f.Mesh = new f.MeshCube("ObstacleMesh");
    private static material: f.Material = new f.Material("MatObstacle", f.ShaderFlat, new f.CoatColored(new f.Color(0.7, 0.7, 0.7, 1)));
    public name: string = "CmpScriptObstacle";
    private node: f.Node;
    constructor() {
      super();
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndComponentAdd);
    }

    private hndComponentAdd = (): void => {
      this.node = this.getContainer();
      this.node.addComponent(new f.ComponentTransform());
      this.generateProps();
    };

    private generateProps = (): void => {
      let randomNumber: number = Math.random() * 4 + 4;
      for (let index: number = 0; index < randomNumber; index++) {
        this.createProp();
      }
    };

    private createProp = (): void => {
      let prop: f.Node = new f.Node("Prop");
      prop.addComponent(new f.ComponentTransform());
      prop.addComponent(new f.ComponentMaterial(ComponentScriptGeneratedProps.material));
      prop.addComponent(new f.ComponentMesh(ComponentScriptGeneratedProps.mesh));
      prop.mtxLocal.translate(new f.Vector3(Math.random() * 4 - 2, 2 + Math.random() * 2, Math.random() * 4 - 2));
      prop.mtxLocal.scale(new f.Vector3(Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5));
      let propRigid: f.ComponentRigidbody = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
      prop.addComponent(propRigid);
      prop.addComponent(new ComponentScriptProp());
      this.node.addChild(prop);
      f.Physics.adjustTransforms(this.node, true);
    };
  }
}
