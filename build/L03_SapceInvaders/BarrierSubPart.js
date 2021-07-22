"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    class BarrierSubPart extends SpaceInvaders.QuadNode {
        constructor(_pos) {
            let scale = new f.Vector2(0.1, 0.1);
            super("BarrierSubPart" + _pos.x + "/" + _pos.y, _pos, scale);
            this.getComponent(f.ComponentMaterial).clrPrimary = new f.Color(0.3, 1, 0, 1);
        }
    }
    SpaceInvaders.BarrierSubPart = BarrierSubPart;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=BarrierSubPart.js.map