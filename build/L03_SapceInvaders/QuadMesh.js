"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    let QuadNode = /** @class */ (() => {
        class QuadNode extends f.Node {
            constructor(_name, _pos, _scale) {
                super(_name);
                let translate = new f.Vector3(_pos.x, _pos.y, 0);
                let scale = new f.Vector3(_scale.x, _scale.y, 0);
                let cmpTransform = new f.ComponentTransform();
                cmpTransform.mtxLocal.translate(translate);
                cmpTransform.mtxLocal.scale(scale);
                this.addComponent(cmpTransform);
                this.addComponent(new f.ComponentMaterial(SpaceInvaders.greenMaterial));
                this.addComponent(new f.ComponentMesh(SpaceInvaders.barrierMesh));
            }
        }
        QuadNode.mesh = new f.MeshQuad("Quad");
        QuadNode.material = new f.Material("Material", f.ShaderUniColor, new f.CoatColored());
        return QuadNode;
    })();
    SpaceInvaders.QuadNode = QuadNode;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=QuadMesh.js.map