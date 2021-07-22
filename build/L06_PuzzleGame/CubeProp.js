"use strict";
var L06_PuzzleGame;
(function (L06_PuzzleGame) {
    var f = FudgeCore;
    let CubeProp = /** @class */ (() => {
        class CubeProp extends L06_PuzzleGame.Prop {
            constructor(_name, _position, _scale) {
                super(_name, _position, _scale, CubeProp.mesh, f.COLLIDER_TYPE.CUBE);
            }
        }
        CubeProp.mesh = new f.MeshCube("Cube");
        return CubeProp;
    })();
    L06_PuzzleGame.CubeProp = CubeProp;
})(L06_PuzzleGame || (L06_PuzzleGame = {}));
//# sourceMappingURL=CubeProp.js.map