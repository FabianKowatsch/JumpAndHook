"use strict";
var L06_PuzzleGame;
(function (L06_PuzzleGame) {
    var f = FudgeCore;
    class ComponentScriptProp extends f.ComponentScript {
        constructor() {
            super();
            this.name = "CmpScriptProp";
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndComponentAdd.bind(this));
        }
        hndComponentAdd(_event) {
            this.getContainer().getComponent(f.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollision.bind(this));
        }
        onCollision(_event) {
            let parent = this.getContainer();
            if (_event.cmpRigidbody != parent.getAncestor().getChildrenByName("Avatar")[0].getComponent(f.ComponentRigidbody))
                parent.getComponent(f.ComponentAudio).play(true);
        }
    }
    L06_PuzzleGame.ComponentScriptProp = ComponentScriptProp;
})(L06_PuzzleGame || (L06_PuzzleGame = {}));
//# sourceMappingURL=ComponentScriptProp.js.map