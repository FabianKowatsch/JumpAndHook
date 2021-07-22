"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    let GameState;
    (function (GameState) {
        GameState[GameState["running"] = 0] = "running";
        GameState[GameState["over"] = 1] = "over";
        GameState[GameState["menu"] = 2] = "menu";
    })(GameState = SpaceInvaders.GameState || (SpaceInvaders.GameState = {}));
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=GameState.js.map