"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let EVENT_PLATFORM;
    (function (EVENT_PLATFORM) {
        EVENT_PLATFORM["BALL"] = "ballEnter";
    })(EVENT_PLATFORM = JumpandHook.EVENT_PLATFORM || (JumpandHook.EVENT_PLATFORM = {}));
    let ComponentScriptPlatform = /** @class */ (() => {
        class ComponentScriptPlatform extends f.ComponentScript {
            constructor(_index, _isFirst, _timeStart, _timeLoss) {
                super();
                this.name = "CmpScriptPlatform";
                this.allowNextPlatform = true;
                this.isCompleted = false;
                this.hndAdd = (_event) => {
                    this.node = this.getContainer();
                    if (!this.isFirst) {
                        let transform = new f.Matrix4x4();
                        transform.translate(new f.Vector3(ComponentScriptPlatform.translationFactor * this.index, Math.random() * 4 - 2, Math.random() * 4 - 2));
                        transform.rotate(new f.Vector3(0, (Math.random() - 0.5) * 20, 0));
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
                        this.addObstacleOrTrap();
                    }
                    this.addNextTrigger();
                    this.addDeathTrigger();
                    f.Physics.adjustTransforms(this.node.getParent(), true);
                    let timeout = this.timeStart - this.index * this.timeLoss;
                    let timeLeft = timeout;
                    setInterval(() => {
                        if (!this.isCompleted && timeLeft > 0) {
                            timeLeft = timeLeft - 100;
                            JumpandHook.uiLive.time = timeLeft / 1000;
                        }
                        // tslint:disable-next-line: align
                    }, 100);
                    setTimeout(() => {
                        this.sinkPlatform();
                        // tslint:disable-next-line: align
                    }, timeout);
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
                this.spawnNextPlatform = (_event) => {
                    if (_event.cmpRigidbody.physicsType != 1 && _event.cmpRigidbody.getContainer().name === "Avatar" && this.allowNextPlatform) {
                        this.isCompleted = true;
                        let nextPlatform = new f.Node("platform" + this.index + 1);
                        this.node.getParent().addChild(nextPlatform);
                        nextPlatform.addComponent(new ComponentScriptPlatform(this.index + 1, false, this.timeStart, this.timeLoss));
                        let trigger = this.triggerNode.getComponent(f.ComponentRigidbody);
                        trigger.removeEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.spawnNextPlatform);
                        this.triggerNode.removeComponent(trigger);
                        JumpandHook.game.solvedPlatforms++;
                        JumpandHook.uiLive.score = JumpandHook.game.solvedPlatforms;
                    }
                };
                this.mesh = f.Project.resources[ComponentScriptPlatform.meshId];
                this.material = f.Project.resources[ComponentScriptPlatform.materialId];
                this.index = _index;
                this.isFirst = _isFirst;
                this.timeLoss = _timeLoss;
                this.timeStart = _timeStart;
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndAdd);
                setTimeout(() => {
                    f.Physics.adjustTransforms(this.node.getParent(), true);
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
                this.triggerNode.mtxLocal.scale(new f.Vector3(4, 4, 10));
                this.triggerNode.mtxLocal.translate(new f.Vector3(1.5, 0, 0));
                this.node.appendChild(this.triggerNode);
                f.Physics.adjustTransforms(this.node.getAncestor(), true);
                cmpRigid.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.spawnNextPlatform);
            }
            addDeathTrigger() {
                this.deathNode = new f.Node("DeathTrigger");
                let cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
                this.deathNode.addComponent(cmpRigid);
                this.deathNode.addComponent(new f.ComponentTransform());
                this.deathNode.mtxLocal.scale(new f.Vector3(100, 1, 100));
                this.deathNode.mtxLocal.translate(new f.Vector3(0, -20, 0));
                this.node.appendChild(this.deathNode);
                f.Physics.adjustTransforms(this.node.getAncestor(), true);
                cmpRigid.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.setGameOverState);
            }
            addObstacleOrTrap() {
                this.trapNode = new f.Node("trap" + this.index);
                this.node.addChild(this.trapNode);
                let randomNumber = Math.round(Math.random() * 4);
                switch (randomNumber) {
                    case 0:
                        let cmpScriptObstacle = new JumpandHook.ComponentScriptObstacle();
                        this.trapNode.addComponent(cmpScriptObstacle);
                        break;
                    case 1:
                        let cmpScriptTrap = new JumpandHook.ComponentScriptTrap();
                        this.trapNode.addComponent(cmpScriptTrap);
                        break;
                    case 3:
                        this.allowNextPlatform = false;
                        let cmpScriptBallGame = new JumpandHook.ComponentScriptBallGame();
                        this.trapNode.addComponent(cmpScriptBallGame);
                        cmpScriptBallGame.addEventListener(EVENT_PLATFORM.BALL, () => {
                            this.allowNextPlatform = true;
                        });
                        break;
                    case 4:
                        let cmpScriptProps = new JumpandHook.ComponentScriptGeneratedProps();
                        this.trapNode.addComponent(cmpScriptProps);
                        break;
                    default:
                        let cmpScriptObstacle2 = new JumpandHook.ComponentScriptObstacle();
                        this.trapNode.addComponent(cmpScriptObstacle2);
                        break;
                }
            }
            sinkPlatform() {
                f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.lower);
                if (this.trapNode) {
                    this.trapNode.activate(false);
                    this.trapNode.getChildren().forEach((child) => {
                        if (child.getComponent(f.ComponentRigidbody))
                            child.removeComponent(child.getComponent(f.ComponentRigidbody));
                    });
                }
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