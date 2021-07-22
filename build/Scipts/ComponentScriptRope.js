"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptRope = /** @class */ (() => {
        class ComponentScriptRope extends f.ComponentScript {
            constructor(_target, _animFactor) {
                super();
                this.name = "CmpScriptRope";
                this.currentScaling = 1;
                this.towards = true;
                this.hndAdd = (_event) => {
                    this.startAnimation();
                };
                this.animate = (_event) => {
                    let currentTransform = this.pivotNode.getComponent(f.ComponentTransform);
                    let gun = this.pivotNode.getParent();
                    let gunPos = gun.mtxWorld.translation;
                    let nodePos = this.targetNode.mtxWorld.translation;
                    let distance = this.targetNode.mtxWorld.translation;
                    distance.subtract(gunPos);
                    if (currentTransform.mtxLocal.scaling.z < distance.magnitude && this.towards) {
                        currentTransform.lookAt(nodePos);
                        this.pivotNode.mtxLocal.scaleZ(this.currentScaling);
                        this.currentScaling += this.animationFactor;
                    }
                    else {
                        this.towards = false;
                        if (currentTransform.mtxLocal.scaling.z > 1) {
                            currentTransform.lookAt(nodePos);
                            this.pivotNode.mtxLocal.scaleZ(this.currentScaling);
                            this.currentScaling -= this.animationFactor;
                        }
                        else {
                            f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.animate);
                            gun.removeChild(this.pivotNode);
                        }
                    }
                };
                this.targetNode = _target;
                this.animationFactor = _animFactor;
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndAdd);
            }
            startAnimation() {
                this.pivotNode = this.getContainer();
                this.ropeNode = new f.Node("Rope");
                let cmpTransform = new f.ComponentTransform();
                this.pivotNode.addComponent(cmpTransform);
                this.pivotNode.mtxLocal.translateX(0.15);
                this.pivotNode.mtxLocal.lookAt(this.targetNode.mtxWorld.translation);
                this.ropeNode.addComponent(new f.ComponentMaterial(ComponentScriptRope.material));
                this.ropeNode.addComponent(new f.ComponentMesh(ComponentScriptRope.mesh));
                let ropeTransform = new f.ComponentTransform();
                ropeTransform.mtxLocal.scale(new f.Vector3(0.05, 0.05, 1));
                ropeTransform.mtxLocal.translate(new f.Vector3(0, 0, 0.5));
                this.ropeNode.addComponent(ropeTransform);
                this.pivotNode.addChild(this.ropeNode);
                f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.animate);
            }
        }
        ComponentScriptRope.material = new f.Material("MaterialRope", f.ShaderFlat, new f.CoatColored(f.Color.CSS("SaddleBrown")));
        ComponentScriptRope.mesh = new f.MeshCube("Cube");
        return ComponentScriptRope;
    })();
    JumpandHook.ComponentScriptRope = ComponentScriptRope;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptRope.js.map