"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var f = FudgeCore;
    const frameRate = 60;
    const rotSpeed = 90;
    let node = new f.Node("test");
    let viewport = new f.Viewport();
    window.addEventListener("load", hndlLoad);
    function hndlLoad(_event) {
        const canvas = document.querySelector("#viewport");
        let mesh = new f.MeshCube("Cube");
        let material = new f.Material("Mat", f.ShaderUniColor, new f.CoatColored(new f.Color(0.6, 1, 0, 1)));
        node.addComponent(new f.ComponentTransform());
        node.addComponent(new f.ComponentMesh(mesh));
        node.addComponent(new f.ComponentMaterial(material));
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(3);
        cmpCamera.mtxPivot.rotateY(180);
        console.log(cmpCamera);
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        viewport.draw();
        f.Loop.start(f.LOOP_MODE.TIME_REAL, frameRate);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        node
            .getComponent(f.ComponentTransform)
            .mtxLocal.rotateY((rotSpeed * f.Loop.timeFrameReal) / 1000);
        viewport.draw();
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=Test.js.map