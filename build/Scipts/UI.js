"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    var fUi = FudgeUserInterface;
    class LiveUi extends f.Mutable {
        constructor() {
            super(...arguments);
            this.score = 0;
            this.time = 0;
        }
        reduceMutator(_mutator) {
            return;
        }
    }
    JumpandHook.LiveUi = LiveUi;
    class MenuUi extends f.Mutable {
        constructor() {
            super(...arguments);
            this.musicVolume = 10;
            this.effectVolume = 10;
        }
        reduceMutator(_mutator) {
            return;
        }
    }
    JumpandHook.MenuUi = MenuUi;
    JumpandHook.uiLive = new LiveUi();
    JumpandHook.uiMenu = new MenuUi();
    class UI {
        static updateLive() {
            let ui = document.getElementById("ui");
            UI.controllerLive = new fUi.Controller(JumpandHook.uiLive, ui);
            UI.controllerLive.updateUserInterface();
        }
        static updateVolume() {
            let ui = document.getElementById("options");
            fUi.Controller.updateMutator(ui, JumpandHook.uiMenu);
        }
    }
    JumpandHook.UI = UI;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=UI.js.map