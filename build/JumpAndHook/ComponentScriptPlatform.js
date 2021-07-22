"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptPlatform = /** @class */ (() => {
        class ComponentScriptPlatform extends f.ComponentScript {
            constructor(_index, _isFirst, _timeLoss) {
                super();
                this.name = "CmpScriptPlatform";
                this.hndAdd = (_event) => {
                    this.node = this.getContainer();
                    if (!this.isFirst) {
                        let transform = new f.Matrix4x4();
                        transform.translate(new f.Vector3(ComponentScriptPlatform.translationFactor * this.index, 0, Math.random() * 4 - 2));
                        this.node.addComponent(new f.ComponentTransform(transform));
                        this.node.addComponent(new f.ComponentMaterial(new f.Material("MaterialPlatform", f.ShaderFlat, new f.CoatColored(f.Color.CSS("white")))));
                        let mesh = new f.ComponentMesh(this.mesh);
                        mesh.mtxPivot.scale(new f.Vector3(15, 1, 10));
                        this.node.addComponent(mesh);
                        this.addNextNode();
                        let cmpRigid = new f.ComponentRigidbody(100, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                        cmpRigid.restitution = 0;
                        cmpRigid.friction = 10;
                        this.node.addComponent(cmpRigid);
                        // this.addTraps();
                    }
                    this.addDeathTrigger();
                    this.addNextTrigger();
                    f.Physics.adjustTransforms(this.node.getParent(), true);
                    let timeout = 10000 - this.index * this.timeLoss;
                    setTimeout(() => {
                        this.sinkPlatform();
                    }, timeout);
                };
                this.spawnNextPlatform = (_event) => {
                    if (_event.cmpRigidbody.physicsType != 1 && _event.cmpRigidbody.getContainer().name === "Avatar") {
                        let nextPlatform = new f.Node("platform" + this.index + 1);
                        this.node.getParent().addChild(nextPlatform);
                        nextPlatform.addComponent(new ComponentScriptPlatform(this.index + 1, false, this.timeLoss));
                        let trigger = this.triggerNode.getComponent(f.ComponentRigidbody);
                        trigger.removeEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.spawnNextPlatform);
                        this.triggerNode.removeComponent(trigger);
                        JumpandHook.game.solvedPlatforms++;
                        JumpandHook.uiLive.score = JumpandHook.game.solvedPlatforms;
                    }
                };
                this.setGameOverState = (_event) => {
                    let enteredNode = _event.cmpRigidbody.getContainer();
                    if (_event.cmpRigidbody.physicsType != 1) {
                        if (enteredNode.name === "Avatar") {
                            JumpandHook.game.state = JumpandHook.GAMESTATE.MENU;
                        }
                        else {
                            enteredNode.removeComponent(_event.cmpRigidbody);
                            enteredNode.getAncestor().removeChild(enteredNode);
                        }
                    }
                };
                this.lower = () => {
                    let rigid = this.node.getComponent(f.ComponentRigidbody);
                    rigid.translateBody(new f.Vector3(0, -1, 0));
                    if (rigid.getPosition().y <= -70) {
                        f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.lower);
                    }
                };
                this.mesh = f.Project.resources[ComponentScriptPlatform.meshId];
                this.material = f.Project.resources[ComponentScriptPlatform.materialId];
                this.index = _index;
                this.isFirst = _isFirst;
                this.timeLoss = _timeLoss;
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndAdd);
                setTimeout(() => {
                    f.Physics.adjustTransforms(this.node.getParent(), true), 10;
                });
            }
            addNextNode() {
                let child = new f.Node("next" + this.index);
                let transformChild = new f.Matrix4x4();
                transformChild.translate(new f.Vector3(ComponentScriptPlatform.translationFactor / 2, 10, 0));
                transformChild.scale(new f.Vector3(2, 2, 2));
                child.addComponent(new f.ComponentTransform(transformChild));
                child.addComponent(new f.ComponentMesh(this.mesh));
                child.addComponent(new f.ComponentMaterial(this.material));
                child.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
                this.node.addChild(child);
            }
            addNextTrigger() {
                this.triggerNode = new f.Node("NextTrigger" + this.index.toString());
                let cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
                this.triggerNode.addComponent(cmpRigid);
                this.triggerNode.addComponent(new f.ComponentTransform());
                this.triggerNode.mtxLocal.scale(new f.Vector3(2, 6, 10));
                this.triggerNode.mtxLocal.translate(new f.Vector3(3.5, 0, 0));
                this.node.appendChild(this.triggerNode);
                f.Physics.adjustTransforms(this.node.getAncestor(), true);
                cmpRigid.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.spawnNextPlatform);
            }
            addDeathTrigger() {
                this.deathNode = new f.Node("DeathTrigger" + this.index.toString());
                let cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
                this.deathNode.addComponent(cmpRigid);
                this.deathNode.addComponent(new f.ComponentTransform());
                this.deathNode.mtxLocal.scale(new f.Vector3(100, 1, 100));
                this.deathNode.mtxLocal.translate(new f.Vector3(0, -20, 0));
                this.node.appendChild(this.deathNode);
                f.Physics.adjustTransforms(this.node.getAncestor(), true);
                cmpRigid.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.setGameOverState);
            }
            addTraps() {
                let trapArray = new Array();
                for (let index = 0; index < Math.round(Math.random() * 3); index++) {
                    trapArray.push(new f.Node("Trap" + index));
                }
                trapArray.forEach((trap) => {
                    trap.addComponent(new JumpandHook.CmpScriptTrap(this.mesh, this.material));
                });
            }
            sinkPlatform() {
                f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.lower);
            }
        }
        ComponentScriptPlatform.materialId = "Material|2021-04-27T14:36:49.332Z|73063";
        ComponentScriptPlatform.meshId = "MeshCube|2021-04-27T14:35:44.543Z|88040";
        ComponentScriptPlatform.translationFactor = 28;
        return ComponentScriptPlatform;
    })();
    JumpandHook.ComponentScriptPlatform = ComponentScriptPlatform;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptPlatform.js.map