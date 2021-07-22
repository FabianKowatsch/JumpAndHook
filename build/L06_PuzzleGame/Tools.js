"use strict";
var L06_PuzzleGame;
(function (L06_PuzzleGame) {
    class Tools {
        static drawLine(_viewport, _point1, _point2) {
            let canvas = document.querySelector("canvas");
            var ctx = canvas.getContext("2d");
            //   let v1: f.Vector2 =
            let pos1 = _viewport.pointWorldToClient(_point1);
            let pos2 = _viewport.pointWorldToClient(_point2);
            ctx.beginPath();
            ctx.moveTo(pos1.x, pos1.y);
            ctx.lineTo(pos2.x, pos2.y);
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
    }
    L06_PuzzleGame.Tools = Tools;
})(L06_PuzzleGame || (L06_PuzzleGame = {}));
//# sourceMappingURL=Tools.js.map