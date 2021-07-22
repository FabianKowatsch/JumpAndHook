"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    class Invader extends SpaceInvaders.QuadNode {
        constructor(_pos) {
            let _scale = new f.Vector2(0.5, 0.5);
            super("Invader" + _pos.x + "/" + _pos.y, _pos, _scale, "invader");
            this.setRectPosition();
        }
    }
    SpaceInvaders.Invader = Invader;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Invader.js.map