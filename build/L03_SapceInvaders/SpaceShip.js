"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    let SpaceShip = /** @class */ (() => {
        class SpaceShip extends f.Node {
            constructor() {
                super("SpaceShip");
                let scale = new f.Vector3(1, 1, 0);
                let cmpTransform = new f.ComponentTransform();
                cmpTransform.mtxLocal.scale(scale);
                this.addComponent(cmpTransform);
                this.addComponent(new f.ComponentMaterial(SpaceShip.material));
                this.addComponent(new f.ComponentMesh(SpaceShip.mesh));
            }
        }
        SpaceShip.mesh = new f.MeshPolygon("ShipPolygon", [
            new f.Vector2(0.1, 0),
            new f.Vector2(0.5, 0),
            new f.Vector2(0.5, 0.3),
            new f.Vector2(0, 0.3),
            new f.Vector2(0.1, 0.5),
            new f.Vector2(-0.1, 0.5),
            new f.Vector2(-0.1, 0.3),
            new f.Vector2(-0.5, 0.3),
            new f.Vector2(-0.5, 0)
        ], true);
        SpaceShip.material = new f.Material("ShipMaterial", f.ShaderUniColor, new f.CoatColored(new f.Color(0.3, 1, 0, 1)));
        return SpaceShip;
    })();
    SpaceInvaders.SpaceShip = SpaceShip;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceShip.js.map