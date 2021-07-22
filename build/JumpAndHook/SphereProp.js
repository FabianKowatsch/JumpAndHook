"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let SphereProp = /** @class */ (() => {
        class SphereProp extends Prop {
            constructor(_name, _position, _scale) {
                super(_name, _position, _scale, SphereProp.mesh, f.COLLIDER_TYPE.SPHERE);
            }
        }
        SphereProp.mesh = new f.MeshSphere("Sphere");
        return SphereProp;
    })();
    JumpandHook.SphereProp = SphereProp;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=SphereProp.js.map