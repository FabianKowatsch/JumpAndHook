"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptBallGame = /** @class */ (() => {
        class ComponentScriptBallGame extends f.ComponentScript {
            constructor() {
                super();
                this.name = "CmpScriptBasket";
                this.hndComponentAdd = () => {
                    this.node = this.getContainer();
                    this.node.addComponent(new f.ComponentTransform());
                    this.addBasketBall();
                };
                this.addBasketBall = () => {
                    let randomNumber = Math.random();
                    if (randomNumber > 0.5)
                        randomNumber = 1;
                    else
                        randomNumber = -1;
                    let lower = this.createBasketPart("lower");
                    lower.mtxLocal.translate(new f.Vector3(0, 2, 4 * randomNumber));
                    lower.mtxLocal.scale(new f.Vector3(0.2, 5, 0.2));
                    this.node.addChild(lower);
                    let middle = this.createBasketPart("middle");
                    middle.mtxLocal.translate(new f.Vector3(0, 4.5, 4 * randomNumber));
                    middle.mtxLocal.rotate(new f.Vector3(0, 0, 90));
                    middle.mtxLocal.scale(new f.Vector3(0.2, 4, 0.2));
                    this.node.addChild(middle);
                    let right = this.createBasketPart("right");
                    right.mtxLocal.translate(new f.Vector3(2, 6, 4 * randomNumber));
                    right.mtxLocal.scale(new f.Vector3(0.2, 3, 0.2));
                    this.node.addChild(right);
                    let left = this.createBasketPart("left");
                    left.mtxLocal.translate(new f.Vector3(-2, 6, 4 * randomNumber));
                    left.mtxLocal.scale(new f.Vector3(0.2, 3, 0.2));
                    this.node.addChild(left);
                    //Audio
                    this.cmpAudio = new f.ComponentAudio(ComponentScriptBallGame.audio, false, false);
                    middle.addComponent(this.cmpAudio);
                    this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_OUTER_ANGLE, 360);
                    this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_INNER_ANGLE, 360);
                    this.cmpAudio.volume = 1 * (JumpandHook.uiMenu.volume / 100);
                    //Ball
                    let ball = new f.Node("Ball");
                    ball.addComponent(new f.ComponentTransform());
                    ball.addComponent(new f.ComponentMaterial(new f.Material("BasketBall", f.ShaderFlat, new f.CoatColored(f.Color.CSS("orange")))));
                    ball.addComponent(new f.ComponentMesh(new f.MeshSphere()));
                    ball.mtxLocal.translate(new f.Vector3(0, 2, -4 * randomNumber));
                    this.ballRigid = new f.ComponentRigidbody(8, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE, f.PHYSICS_GROUP.DEFAULT);
                    ball.addComponent(this.ballRigid);
                    ball.addComponent(new JumpandHook.ComponentScriptProp());
                    this.node.addChild(ball);
                    f.Physics.adjustTransforms(this.node, true);
                    this.addTrigger(randomNumber);
                };
                this.createBasketPart = (_name) => {
                    let node = new f.Node(_name);
                    let cmpMesh = new f.ComponentMesh(ComponentScriptBallGame.mesh);
                    let cmpMaterial = new f.ComponentMaterial(ComponentScriptBallGame.material);
                    let cmpTransform = new f.ComponentTransform();
                    let cmpRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                    node.addComponent(cmpMesh);
                    node.addComponent(cmpMaterial);
                    node.addComponent(cmpTransform);
                    node.addComponent(cmpRigidbody);
                    return node;
                };
                this.hndTriggerEnter = (_event) => {
                    if (_event.cmpRigidbody == this.ballRigid) {
                        this.dispatchEvent(new Event(JumpandHook.EVENT_PLATFORM.BALL));
                        this.cmpAudio.play(true);
                    }
                };
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
            }
            addTrigger(_position) {
                this.triggerNode = new f.Node("BasketTrigger");
                let cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.TRIGGER);
                this.triggerNode.addComponent(cmpRigid);
                this.triggerNode.addComponent(new f.ComponentTransform());
                this.triggerNode.mtxLocal.translate(new f.Vector3(0, 6, 4 * _position));
                this.triggerNode.mtxLocal.scale(new f.Vector3(4, 3, 0.5));
                this.node.appendChild(this.triggerNode);
                f.Physics.adjustTransforms(this.node.getAncestor(), true);
                cmpRigid.addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.hndTriggerEnter);
            }
        }
        ComponentScriptBallGame.audio = new f.Audio(JumpandHook.Utils.path() + "../Assets/Sound/bell.mp3");
        ComponentScriptBallGame.mesh = new f.MeshCube("MeshBasket");
        ComponentScriptBallGame.material = new f.Material("MatBasket", f.ShaderFlat, new f.CoatColored(new f.Color(0, 1, 0, 1)));
        return ComponentScriptBallGame;
    })();
    JumpandHook.ComponentScriptBallGame = ComponentScriptBallGame;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptBallGame.js.map