"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var f = FudgeCore;
    // const frameRate: number = 60;
    const enemiesPerRow = 9;
    const rowAmount = 3;
    const barrierAmount = 5;
    const startPosX = -(enemiesPerRow - 1) / 2;
    const startPosY = 8;
    const root = new f.Node("Root");
    let enemies = createEnemies();
    let spaceShip = createSpaceShip();
    let barriers = createBarriers();
    root.addChild(spaceShip);
    barriers.forEach((barrier) => {
        root.addChild(barrier);
    });
    enemies.forEach((enemy) => {
        root.addChild(enemy);
    });
    let viewport = new f.Viewport();
    window.addEventListener("load", init);
    function init(_event) {
        const canvas = document.querySelector("#viewport");
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translate(new f.Vector3(0, 5, 15));
        cmpCamera.mtxPivot.rotateY(180);
        console.log(root);
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        viewport.draw();
    }
    function createEnemies() {
        let enemies = [];
        let counterRow = 0;
        let counterEnemies = 0;
        const enemyMesh = new f.MeshSphere("EnemyCube", 10, 10);
        const enemyMaterial = new f.Material("Mat", f.ShaderUniColor, new f.CoatColored(new f.Color(1, 1, 1, 1)));
        for (let i = 0; i < enemiesPerRow * rowAmount; i++) {
            enemies[i] = new f.Node("enemy_" + i.toString());
            let translate = new f.Vector3(startPosX + counterEnemies, startPosY + counterRow, 0);
            let scale = new f.Vector3(0.5, 0.5, 0);
            let transform = new f.ComponentTransform();
            transform.mtxLocal.translate(translate);
            transform.mtxLocal.scale(scale);
            enemies[i].addComponent(transform);
            enemies[i].addComponent(new f.ComponentMaterial(enemyMaterial));
            enemies[i].addComponent(new f.ComponentMesh(enemyMesh));
            if (counterEnemies === enemiesPerRow - 1) {
                counterRow++;
                counterEnemies = 0;
            }
            else {
                counterEnemies++;
            }
        }
        return enemies;
    }
    function createSpaceShip() {
        let spaceShip = new f.Node("SpaceShip");
        const spaceShipMesh = new f.MeshCube("ShipCube");
        const spaceShipMaterial = new f.Material("Mat", f.ShaderUniColor, new f.CoatColored(new f.Color(0.3, 1, 0, 1)));
        let scale = new f.Vector3(1, 0.5, 0);
        let transform = new f.ComponentTransform();
        transform.mtxLocal.scale(scale);
        spaceShip.addComponent(transform);
        spaceShip.addComponent(new f.ComponentMaterial(spaceShipMaterial));
        spaceShip.addComponent(new f.ComponentMesh(spaceShipMesh));
        return spaceShip;
    }
    function createBarriers() {
        let barriers = [];
        let barrierMesh = new f.MeshCube("barrierMesh");
        let barrierMaterial = new f.Material("Mat", f.ShaderUniColor, new f.CoatColored(new f.Color(0.3, 1, 0, 1)));
        let counter = 0;
        for (let i = 0; i < barrierAmount; i++) {
            barriers[i] = new f.Node("barrier_" + i.toString());
            let translate = new f.Vector3(startPosX + counter, 2, 0);
            let scale = new f.Vector3(1, 1, 0);
            let transform = new f.ComponentTransform();
            transform.mtxLocal.translate(translate);
            transform.mtxLocal.scale(scale);
            barriers[i].addComponent(transform);
            barriers[i].addComponent(new f.ComponentMaterial(barrierMaterial));
            barriers[i].addComponent(new f.ComponentMesh(barrierMesh));
            counter += -((2 * startPosX) / (barrierAmount - 1));
        }
        console.log(startPosX);
        return barriers;
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=Test.js.map