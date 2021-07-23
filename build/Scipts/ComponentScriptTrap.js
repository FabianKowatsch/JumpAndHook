"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptTrap = /** @class */ (() => {
        class ComponentScriptTrap extends f.ComponentScript {
            constructor() {
                super();
                this.name = "CmpScriptTrap";
                this.hndComponentAdd = () => {
                    this.node = this.getContainer();
                    this.node.addComponent(new f.ComponentTransform());
                    this.addTraps();
                };
                this.addTraps = () => {
                    this.trap = new f.Node("trap");
                    let cmpTransform = new f.ComponentTransform();
                    this.trap.addComponent(cmpTransform);
                    this.trap.mtxLocal.translate(new f.Vector3(-2, 5, 0));
                    this.trap.mtxLocal.scale(new f.Vector3(0.4, 10, 0.2));
                    this.trap.addComponent(new f.ComponentMaterial(ComponentScriptTrap.material));
                    let cmMesh = new f.ComponentMesh(ComponentScriptTrap.mesh);
                    this.trap.addComponent(cmMesh);
                    this.trapRigid = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                    this.trap.addComponent(this.trapRigid);
                    this.node.addChild(this.trap);
                    this.trap2 = new f.Node("trap");
                    let cmpTransform2 = new f.ComponentTransform();
                    this.trap2.addComponent(cmpTransform2);
                    this.trap2.mtxLocal.translate(new f.Vector3(2, 5, 0));
                    this.trap2.mtxLocal.rotate(new f.Vector3(90, 0, 0));
                    this.trap2.mtxLocal.scale(new f.Vector3(0.4, 10, 0.2));
                    this.trap2.addComponent(new f.ComponentMaterial(ComponentScriptTrap.material));
                    let cmMesh2 = new f.ComponentMesh(ComponentScriptTrap.mesh);
                    this.trap2.addComponent(cmMesh2);
                    this.trapRigid2 = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                    this.trap2.addComponent(this.trapRigid2);
                    this.node.addChild(this.trap2);
                    f.Physics.adjustTransforms(this.node, true);
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.rotate);
                };
                this.rotate = () => {
                    this.trapRigid.rotateBody(new f.Vector3(5, 0, 0));
                    this.trapRigid2.rotateBody(new f.Vector3(5, 0, 0));
                };
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
            }
        }
        ComponentScriptTrap.mesh = new f.MeshCube("MeshTrap");
        ComponentScriptTrap.material = new f.Material("MatTrap", f.ShaderFlat, new f.CoatColored(new f.Color(1, 0, 0, 1)));
        return ComponentScriptTrap;
    })();
    JumpandHook.ComponentScriptTrap = ComponentScriptTrap;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptTrap.js.map