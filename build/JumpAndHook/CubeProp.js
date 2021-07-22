"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let CubeProp = /** @class */ (() => {
        class CubeProp extends Prop {
            constructor(_name, _position, _scale) {
                super(_name, _position, _scale, CubeProp.mesh, f.COLLIDER_TYPE.CUBE);
            }
        }
        CubeProp.mesh = new f.MeshCube("Cube");
        return CubeProp;
    })();
    JumpandHook.CubeProp = CubeProp;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=CubeProp.js.map