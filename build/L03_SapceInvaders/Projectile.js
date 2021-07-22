"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    class Projectile extends SpaceInvaders.QuadNode {
        constructor(_pos) {
            let scale = new f.Vector2(0.1, 0.5);
            super("Projectile", _pos, scale);
            this.getComponent(f.ComponentMaterial).clrPrimary = new f.Color(1, 1, 0, 1);
            this.velocity = 15;
            this.cmpAudio = new f.ComponentAudio(new f.Audio("./Assets/shoot.wav"));
            this.addComponent(this.cmpAudio);
        }
        move() {
            this.mtxLocal.translateY((this.velocity * f.Loop.timeFrameReal) / 1000);
            this.setRectPosition();
        }
    }
    SpaceInvaders.Projectile = Projectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Projectile.js.map