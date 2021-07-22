namespace JumpandHook {
  import f = FudgeCore;
  export class CmpScriptTrap extends ComponentScriptProp {
    public name: string = "CmpScriptProp";
    private mesh: f.Mesh;
    private material: f.Material;
    constructor(_mesh: f.Mesh, _material: f.Material) {
      super();
      this.material = _material;
      this.mesh = _mesh;
    }

    protected hndComponentAdd = (): void => {
      super.hndComponentAdd();
      this.getContainer().addComponent(new f.ComponentMesh(this.mesh));
      this.getContainer().addComponent(new f.ComponentMaterial(this.material));
    };
  }
}
