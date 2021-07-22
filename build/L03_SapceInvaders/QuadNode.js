"use strict";
var SpaceInvaders;
(function (SpaceInvaders) {
    var f = FudgeCore;
    let QuadNode = /** @class */ (() => {
        class QuadNode extends f.Node {
            constructor(_name, _pos, _scale, _texture) {
                super(_name);
                this.rect = new f.Rectangle(_pos.x, _pos.y, _scale.x, _scale.y, f.ORIGIN2D.CENTER);
                let translate = new f.Vector3(_pos.x, _pos.y, 0);
                let scale = new f.Vector3(_scale.x, _scale.y, 0);
                let cmpTransform = new f.ComponentTransform();
                cmpTransform.mtxLocal.translate(translate);
                cmpTransform.mtxLocal.scale(scale);
                this.addComponent(cmpTransform);
                switch (_texture) {
                    case "invader":
                        this.addComponent(new f.ComponentMaterial(QuadNode.materialInvader));
                        break;
                    case "mothership":
                        this.addComponent(new f.ComponentMaterial(QuadNode.materialMothership));
                        break;
                    default:
                        this.addComponent(new f.ComponentMaterial(QuadNode.material));
                        break;
                }
                this.addComponent(new f.ComponentMesh(QuadNode.mesh));
            }
            checkCollision(_target) {
                return this.rect.collides(_target.rect);
            }
            setRectPosition() {
                this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
            }
            updateRectPosition() {
                if (this.getParent() == null)
                    return;
                this.rect.position.x = this.mtxLocal.translation.x + this.getParent().mtxLocal.translation.x - this.rect.size.x / 2;
                this.rect.position.y = this.mtxLocal.translation.y + this.getParent().mtxLocal.translation.y - this.rect.size.y / 2;
            }
        }
        QuadNode.mesh = new f.MeshQuad("Quad");
        QuadNode.material = new f.Material("Material", f.ShaderUniColor, new f.CoatColored());
        QuadNode.textureInvader = new f.TextureImage("./Assets/Invader.png");
        QuadNode.materialInvader = new f.Material("Invader", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), QuadNode.textureInvader));
        QuadNode.textureMothership = new f.TextureImage("./Assets/mothership.png");
        QuadNode.materialMothership = new f.Material("Invader", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), QuadNode.textureMothership));
        return QuadNode;
    })();
    SpaceInvaders.QuadNode = QuadNode;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=QuadNode.js.map