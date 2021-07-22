"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let ComponentScriptProp = /** @class */ (() => {
        class ComponentScriptProp extends f.ComponentScript {
            constructor() {
                super();
                this.name = "CmpScriptProp";
                this.hndComponentAdd = () => {
                    //Audio
                    this.cmpAudio = new f.ComponentAudio(ComponentScriptProp.audio, false, false);
                    this.getContainer().addComponent(this.cmpAudio);
                    this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_OUTER_ANGLE, 360);
                    this.cmpAudio.setPanner(f.AUDIO_PANNER.CONE_INNER_ANGLE, 360);
                    this.getContainer().getComponent(f.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollision);
                };
                this.onCollision = (_event) => {
                    let parent = this.getContainer();
                    if (_event.cmpRigidbody != parent.getAncestor().getChildrenByName("Avatar")[0].getComponent(f.ComponentRigidbody))
                        parent.getComponent(f.ComponentAudio).play(true);
                };
                this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd);
            }
        }
        ComponentScriptProp.audio = new f.Audio("../../L06_PuzzleGame/Assets/Sound/impact.mp3");
        return ComponentScriptProp;
    })();
    JumpandHook.ComponentScriptProp = ComponentScriptProp;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptProp.js.map