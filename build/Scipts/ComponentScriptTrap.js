"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    class ComponentScriptTrap extends JumpandHook.ComponentScriptProp {
        constructor(_mesh, _material) {
            super();
            this.name = "CmpScriptProp";
            this.hndComponentAdd = () => {
                super.hndComponentAdd();
                this.getContainer().addComponent(new f.ComponentMesh(this.mesh));
                this.getContainer().addComponent(new f.ComponentMaterial(this.material));
            };
            this.material = _material;
            this.mesh = _mesh;
        }
    }
    JumpandHook.ComponentScriptTrap = ComponentScriptTrap;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=ComponentScriptTrap.js.map