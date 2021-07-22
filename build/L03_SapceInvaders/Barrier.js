"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    class Barrier extends f.Node {
        constructor(_x, _y) {
            super("Barrier" + _x + "/" + _y);
            let translate = new f.Vector3(_x, _y, 0);
            let scale = new f.Vector3(1, 1, 0);
            let cmpTransform = new f.ComponentTransform();
            cmpTransform.mtxLocal.translate(translate);
            cmpTransform.mtxLocal.scale(scale);
            this.addComponent(cmpTransform);
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 9; j++) {
                    if ((i > 2 || i + j > 4) && i + j < 11) {
                        let x1 = -0.05 - i / 10;
                        let y = -0.45 + j / 10;
                        let subPart1 = new SpaceInvaders.BarrierSubPart(new f.Vector2(x1, y));
                        this.addChild(subPart1);
                        let x2 = 0.05 + i / 10;
                        let subPart2 = new SpaceInvaders.BarrierSubPart(new f.Vector2(x2, y));
                        this.addChild(subPart2);
                    }
                }
            }
        }
    }
    SpaceInvaders.Barrier = Barrier;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Barrier.js.map