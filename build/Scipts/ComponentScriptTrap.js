"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptTrap = /** @class */ (() => {
        class ComponentScriptTrap extends f.ComponentScript {
            constructor() {
                super();
                this.name = "CmpScriptObstacle";
                this.hndComponentAdd = () => {
                    this.node = this.getContainer();
                    this.node.addComponent(new f.ComponentTransform());
                    this.addObstacle();
                };
                this.addObstacle = () => {
                    this.trap = new f.Node("trap");
                    let cmpTransform = new f.ComponentTransform();
                    this.trap.addComponent(cmpTransform);
                    this.trap.mtxLocal.scale(new f.Vector3(10, 4, 0.2));
                    this.trap.mtxLocal.translate(new f.Vector3(0, 0.5, 0));
                    this.trap.addComponent(new f.ComponentMaterial(ComponentScriptTrap.material));
                    this.trap.addComponent(new f.ComponentMesh(this.mesh));
                    this.trapRigid = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                    this.trap.addComponent(this.trapRigid);
                    this.node.addChild(this.trap);
                    f.Physics.adjustTransforms(this.node, true);
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.rotate);
                };
                this.rotate = () => {
                    this.trapRigid.rotateBody(new f.Vector3(0, 5, 0));
                };
                this.mesh = f.Project.resources[ComponentScriptTrap.meshId];
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
            }
        }
        ComponentScriptTrap.meshId = "MeshExtrusion|2021-07-22T15:37:50.445Z|19125";
        ComponentScriptTrap.material = new f.Material("MatTrap", f.ShaderFlat, new f.CoatColored(new f.Color(1, 1, 0, 1)));
        return ComponentScriptTrap;
    })();
    JumpandHook.ComponentScriptTrap = ComponentScriptTrap;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptTrap.js.map