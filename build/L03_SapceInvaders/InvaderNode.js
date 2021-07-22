"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    class InvaderNode extends f.Node {
        constructor(_pos) {
            super("Invaders");
            let translate = new f.Vector3(_pos.x, _pos.y, 0);
            let cmpTransform = new f.ComponentTransform();
            cmpTransform.mtxLocal.translate(translate);
            this.addComponent(cmpTransform);
        }
        move(_direction) {
            this.mtxLocal.translateX(_direction.x);
            this.mtxLocal.translateY(_direction.y);
            for (let invader of this.getChildren()) {
                invader.updateRectPosition();
            }
        }
    }
    SpaceInvaders.InvaderNode = InvaderNode;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=InvaderNode.js.map