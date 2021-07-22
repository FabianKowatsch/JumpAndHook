"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    class Mothership extends SpaceInvaders.QuadNode {
        constructor(_pos) {
            let _scale = new f.Vector2(1, 0.5);
            super("Mothership", _pos, _scale, "mothership");
        }
    }
    SpaceInvaders.Mothership = Mothership;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Mothership.js.map