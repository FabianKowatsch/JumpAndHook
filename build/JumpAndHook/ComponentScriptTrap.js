"use strict";
var JumpandHook;
(function (JumpandHook) {
    class ComponentScriptTrap extends JumpandHook.ComponentScriptProp {
        constructor() {
            super();
            this.name = "CmpScriptProp";
        }
        hndComponentAdd(_event) {
            super.hndComponentAdd(new Event("componentAdd" /* COMPONENT_ADD */));
        }
    }
    JumpandHook.ComponentScriptTrap = ComponentScriptTrap;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptTrap.js.map