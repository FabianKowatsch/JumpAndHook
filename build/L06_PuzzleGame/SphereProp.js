"use strict";
var L06_PuzzleGame;
(function (L06_PuzzleGame) {
    var f = FudgeCore;
    let SphereProp = /** @class */ (() => {
        class SphereProp extends L06_PuzzleGame.Prop {
            constructor(_name, _position, _scale) {
                super(_name, _position, _scale, SphereProp.mesh, f.COLLIDER_TYPE.SPHERE);
            }
        }
        SphereProp.mesh = new f.MeshSphere("Sphere");
        return SphereProp;
    })();
    L06_PuzzleGame.SphereProp = SphereProp;
})(L06_PuzzleGame || (L06_PuzzleGame = {}));
//# sourceMappingURL=SphereProp.js.map