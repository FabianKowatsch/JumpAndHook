"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptObstacle = /** @class */ (() => {
        class ComponentScriptObstacle extends f.ComponentScript {
            constructor() {
                super();
                this.name = "CmpScriptObstacle";
                this.hndComponentAdd = () => {
                    this.node = this.getContainer();
                    this.node.addComponent(new f.ComponentTransform());
                    this.addObstacle();
                };
                this.addObstacle = () => {
                    this.trap = new f.Node("obstacle");
                    let cmpTransform = new f.ComponentTransform();
                    this.trap.addComponent(cmpTransform);
                    this.trap.mtxLocal.scale(new f.Vector3(8, 4, 0.2));
                    this.trap.mtxLocal.translate(new f.Vector3(0, 0.5, 0));
                    this.trap.addComponent(new f.ComponentMaterial(ComponentScriptObstacle.material));
                    this.trap.addComponent(new f.ComponentMesh(ComponentScriptObstacle.mesh));
                    this.trapRigid = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                    this.trap.addComponent(this.trapRigid);
                    this.node.addChild(this.trap);
                    f.Physics.adjustTransforms(this.node, true);
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.rotate);
                };
                this.rotate = () => {
                    this.trapRigid.rotateBody(new f.Vector3(0, 5, 0));
                };
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
            }
        }
        ComponentScriptObstacle.mesh = new f.MeshCube("ObstacleMesh");
        ComponentScriptObstacle.material = new f.Material("MatObstacle", f.ShaderFlat, new f.CoatColored(new f.Color(1, 1, 0, 1)));
        return ComponentScriptObstacle;
    })();
    JumpandHook.ComponentScriptObstacle = ComponentScriptObstacle;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptObstacle.js.map