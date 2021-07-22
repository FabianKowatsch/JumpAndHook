namespace JumpandHook {
  import f = FudgeCore;
  export class ComponentScriptRope extends f.ComponentScript {
    private static material: f.Material = new f.Material("MaterialRope", f.ShaderFlat, new f.CoatColored(f.Color.CSS("SaddleBrown")));
    private static mesh: f.Mesh = new f.MeshCube("Cube");
    public name: string = "CmpScriptRope";
    private pivotNode: f.Node;
    private ropeNode: f.Node;
    private targetNode: f.Node;
    private animationFactor: number;
    private currentScaling: number = 1;
    private towards: boolean = true;
    constructor(_target: f.Node, _animFactor: number) {
      super();
      this.targetNode = _target;
      this.animationFactor = _animFactor;
      this.addEventListener(f.EVENT.COMPONENT_ADD, this.hndAdd);
    }
    private hndAdd = (_event: f.Eventƒ) => {
      this.startAnimation();
    };

    private startAnimation(): void {
      this.pivotNode = this.getContainer();
      this.ropeNode = new f.Node("Rope");
      let cmpTransform: f.ComponentTransform = new f.ComponentTransform();
      this.pivotNode.addComponent(cmpTransform);
      this.pivotNode.mtxLocal.translateX(0.15);
      this.pivotNode.mtxLocal.lookAt(this.targetNode.mtxWorld.translation);
      this.ropeNode.addComponent(new f.ComponentMaterial(ComponentScriptRope.material));
      this.ropeNode.addComponent(new f.ComponentMesh(ComponentScriptRope.mesh));
      let ropeTransform: f.ComponentTransform = new f.ComponentTransform();
      ropeTransform.mtxLocal.scale(new f.Vector3(0.05, 0.05, 1));
      ropeTransform.mtxLocal.translate(new f.Vector3(0, 0, 0.5));
      this.ropeNode.addComponent(ropeTransform);
      this.pivotNode.addChild(this.ropeNode);
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.animate);
    }

    private animate = (_event: f.Eventƒ) => {
      let currentTransform: f.ComponentTransform = this.pivotNode.getComponent(f.ComponentTransform);
      let gun: f.Node = this.pivotNode.getParent();
      let gunPos: f.Vector3 = gun.mtxWorld.translation;
      let nodePos: f.Vector3 = this.targetNode.mtxWorld.translation;
      let distance: f.Vector3 = this.targetNode.mtxWorld.translation;
      distance.subtract(gunPos);
      if (currentTransform.mtxLocal.scaling.z < distance.magnitude && this.towards) {
        currentTransform.lookAt(nodePos);
        this.pivotNode.mtxLocal.scaleZ(this.currentScaling);
        this.currentScaling += this.animationFactor;
      } else {
        this.towards = false;
        if (currentTransform.mtxLocal.scaling.z > 1) {
          currentTransform.lookAt(nodePos);
          this.pivotNode.mtxLocal.scaleZ(this.currentScaling);
          this.currentScaling -= this.animationFactor;
        } else {
          f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.animate);
          gun.removeChild(this.pivotNode);
        }
      }
    };
  }
}
