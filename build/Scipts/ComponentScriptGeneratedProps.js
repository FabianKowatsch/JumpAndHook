"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptGeneratedProps = /** @class */ (() => {
        class ComponentScriptGeneratedProps extends f.ComponentScript {
            constructor() {
                super();
                this.name = "CmpScriptObstacle";
                this.hndComponentAdd = () => {
                    this.node = this.getContainer();
                    this.node.addComponent(new f.ComponentTransform());
                    this.generateProps();
                };
                this.generateProps = () => {
                    let randomNumber = Math.random() * 4 + 4;
                    for (let index = 0; index < randomNumber; index++) {
                        this.createProp();
                    }
                };
                this.createProp = () => {
                    let prop = new f.Node("Prop");
                    prop.addComponent(new f.ComponentTransform());
                    prop.addComponent(new f.ComponentMaterial(ComponentScriptGeneratedProps.material));
                    prop.addComponent(new f.ComponentMesh(ComponentScriptGeneratedProps.mesh));
                    prop.mtxLocal.translate(new f.Vector3(Math.random() * 4 - 2, 2 + Math.random() * 2, Math.random() * 4 - 2));
                    prop.mtxLocal.scale(new f.Vector3(Math.random() * 2 + 0.5, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5));
                    let propRigid = new f.ComponentRigidbody(20, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                    prop.addComponent(propRigid);
                    prop.addComponent(new JumpandHook.ComponentScriptProp());
                    this.node.addChild(prop);
                    f.Physics.adjustTransforms(this.node, true);
                };
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
            }
        }
        ComponentScriptGeneratedProps.mesh = new f.MeshCube("ObstacleMesh");
        ComponentScriptGeneratedProps.material = new f.Material("MatObstacle", f.ShaderFlat, new f.CoatColored(new f.Color(0.7, 0.7, 0.7, 1)));
        return ComponentScriptGeneratedProps;
    })();
    JumpandHook.ComponentScriptGeneratedProps = ComponentScriptGeneratedProps;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptGeneratedProps.js.map