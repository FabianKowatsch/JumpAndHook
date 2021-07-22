"use strict";
var L05_TestScene;
(function (L05_TestScene) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    let graphId = "Graph|2021-04-27T14:37:53.620Z|93013";
    let viewPort;
    //   let environment: f.Node[] = new Array();
    let ball;
    //   let playerBody: f.ComponentRigidbody;
    //Physical Player Variables
    //   let isGrounded: boolean;
    //   let movementspeed: number = 12;
    //   let turningspeed: number = 200;
    //   let playerWeight: number = 75;
    //   let playerJumpForce: number = 500;
    //   let kickStrength: number = 100;
    let cmpCamera;
    //   let yTurn: number = 0;
    //   let forwardMovement: number = 0;
    async function init(_event) {
        await f.Project.loadResourcesFromHTML();
        // pick the graph to show
        let resource = f.Project.resources[graphId];
        let graph = resource;
        f.Debug.log("Graph:", graph);
        const app = document.querySelector("canvas");
        ball = graph.getChildrenByName("ball")[0];
        f.Physics.world.setSolverIterations(1000);
        f.Physics.settings.defaultRestitution = 0.3;
        f.Physics.settings.defaultFriction = 0.8;
        //ball.mtxLocal.translateY(2);
        // ballBody = ball.getComponent(f.ComponentRigidbody);
        // ballBody.restitution = 2.5;
        // hierarchy.appendChild(ball);
        // settingUpEnvironment();
        // settingUpAPlayer();
        // settingUpTrigger();
        // settingUpAJoint();
        //Standard Fudge Scene Initialization - Creating a directional light, a camera and initialize the viewport
        cmpCamera = new f.ComponentCamera();
        cmpCamera.clrBackground = f.Color.CSS("GREY");
        cmpCamera.mtxPivot.translate(new f.Vector3(20, 10, 20));
        cmpCamera.mtxPivot.lookAt(f.Vector3.ZERO());
        viewPort = new f.Viewport();
        viewPort.initialize("Viewport", graph, cmpCamera, app);
        // document.addEventListener("keypress", handler_Key_Pressed);
        // document.addEventListener("keyup", handler_Key_Released);
        //Ball Resetting on enter trigger
        // Implementing kicking mechanic
        f.Physics.adjustTransforms(graph, true);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); //Stard the game loop
        console.log(ball);
    }
    function update() {
        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
        cmpCamera.mtxPivot.lookAt(ball.mtxLocal.translation);
        viewPort.draw();
    }
    //   function createNodeWithComponents(): void {}
    //   function settingUpAPlayer(): void {}
    //   function playerIsGroundedRaycast(): void {}
    //   function handler_Key_Pressed(_event: KeyboardEvent): void {}
    //   function handler_Key_Released(_event: KeyboardEvent): void {}
    //   //Actually moving the player
    //   function player_Movement(_deltaTime: number): void {}
    //   function settingUpEnvironment(): void {}
    //   function settingUpTrigger(): void {}
    //   function resetBall(_event: f.EventPhysics): void {}
    //   function settingUpAJoint(): void {}
})(L05_TestScene || (L05_TestScene = {}));
//# sourceMappingURL=main.js.map