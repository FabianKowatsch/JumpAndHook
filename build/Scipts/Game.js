"use strict";
var JumpandHook;
(function (JumpandHook) {
    var f = FudgeCore;
    let GAMESTATE;
    (function (GAMESTATE) {
        GAMESTATE[GAMESTATE["MENU"] = 0] = "MENU";
        GAMESTATE[GAMESTATE["RUNNING"] = 1] = "RUNNING";
    })(GAMESTATE = JumpandHook.GAMESTATE || (JumpandHook.GAMESTATE = {}));
    let Game = /** @class */ (() => {
        class Game {
            constructor() {
                this.solvedPlatforms = 0;
                this.root = new f.Graph("root");
                // let props: f.Node;
                // const propAmount: number = 12;
                this.isLocked = false;
                this.forwardMovement = 0;
                this.sideMovement = 0;
                this.start = () => {
                    this.canvas.requestPointerLock();
                    this.setStartingPlatform();
                    this.toggleMenu();
                    this.state = GAMESTATE.RUNNING;
                    f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    f.Loop.start();
                };
                this.update = () => {
                    switch (this.state) {
                        case GAMESTATE.RUNNING:
                            f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
                            this.checkKeyboardInputs();
                            this.avatar.move(this.forwardMovement, this.sideMovement);
                            this.avatar.tryGrabLastNode();
                            if (f.AudioManager.default.getGraphListeningTo()) {
                                f.AudioManager.default.update();
                            }
                            this.viewport.draw();
                            break;
                        case GAMESTATE.MENU:
                            f.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                            f.Loop.stop();
                            this.setScores();
                            window.location.reload();
                            break;
                        default:
                            window.location.reload();
                            break;
                    }
                };
                this.state = GAMESTATE.MENU;
                window.addEventListener("load", this.init.bind(this));
            }
            get canvas() {
                if (!this._canvas)
                    this._canvas = document.getElementById("canvas");
                return this._canvas;
            }
            get menu() {
                if (!this._menu)
                    this._menu = document.getElementById("menu");
                return this._menu;
            }
            get startButton() {
                if (!this._startButton)
                    this._startButton = document.getElementById("start");
                return this._startButton;
            }
            async init() {
                let response = await fetch(JumpandHook.Utils.path() + "../config.json");
                this.config = await response.json();
                await f.Project.loadResourcesFromHTML();
                let resource = f.Project.resources[Game.graphId];
                this.root = resource;
                let effectVolume = document.getElementById("effectVolume");
                let musicVolume = document.getElementById("musicVolume");
                this.viewport = new f.Viewport();
                this.initPhysics();
                this.createAvatar();
                this.showScores();
                this.viewport.initialize("Viewport", this.root, this.cmpCamera, this.canvas);
                f.Physics.adjustTransforms(this.root, true);
                document.addEventListener("click", () => {
                    f.AudioManager.default.listenTo(this.root);
                    f.AudioManager.default.listenWith(this.avatar.camNode.getComponent(f.ComponentAudioListener));
                });
                document.addEventListener("keydown", this.hndKeyDown.bind(this));
                document.addEventListener("keyup", this.hndKeyRelease.bind(this));
                document.addEventListener("mousemove", this.hndMouseMovement.bind(this));
                document.addEventListener("mousedown", this.onPointerDown.bind(this));
                document.addEventListener("pointerlockchange", this.pointerLockChange.bind(this));
                this.startButton.addEventListener("click", this.start);
                effectVolume.addEventListener("input", () => {
                    JumpandHook.UI.updateVolume();
                    this.avatar.setEffectVolume(JumpandHook.uiMenu.effectVolume);
                });
                musicVolume.addEventListener("input", () => {
                    JumpandHook.UI.updateVolume();
                    this.avatar.setMusicVolume(JumpandHook.uiMenu.musicVolume);
                });
                JumpandHook.UI.updateLive();
            }
            toggleMenu() {
                switch (this.menu.className) {
                    case "visible":
                        this.menu.className = "hidden";
                        break;
                    case "hidden":
                        this.menu.className = "visible";
                        break;
                }
            }
            hndMouseMovement(_event) {
                if (this.isLocked) {
                    this.avatar.camNode.mtxLocal.rotateY(_event.movementX * Game.camSpeed, true);
                    this.avatar.camNode.mtxLocal.rotateZ(_event.movementY * Game.camSpeed);
                }
            }
            initPhysics() {
                f.Physics.initializePhysics();
                f.Physics.world.setSolverIterations(1000);
                f.Physics.settings.defaultRestitution = 0.3;
                f.Physics.settings.defaultFriction = 0.8;
                f.Physics.settings.debugDraw = this.config.debug;
            }
            hndKeyDown(_event) {
                if (_event.code == f.KEYBOARD_CODE.W) {
                    this.forwardMovement = 1;
                }
                if (_event.code == f.KEYBOARD_CODE.A) {
                    this.sideMovement = -1;
                }
                if (_event.code == f.KEYBOARD_CODE.S) {
                    this.forwardMovement = -1;
                }
                if (_event.code == f.KEYBOARD_CODE.D) {
                    this.sideMovement = 1;
                }
                if (_event.code == f.KEYBOARD_CODE.SHIFT_LEFT) {
                    this.avatar.sprint();
                }
                if (_event.code == f.KEYBOARD_CODE.E) {
                    this.avatar.switchCloseNode();
                }
                if (_event.code == f.KEYBOARD_CODE.Y) {
                    f.Physics.settings.debugDraw = !f.Physics.settings.debugDraw;
                }
            }
            hndKeyRelease(_event) {
                if (_event.code == f.KEYBOARD_CODE.W) {
                    this.forwardMovement = 0;
                }
                if (_event.code == f.KEYBOARD_CODE.A) {
                    this.sideMovement = 0;
                }
                if (_event.code == f.KEYBOARD_CODE.S) {
                    this.forwardMovement = 0;
                }
                if (_event.code == f.KEYBOARD_CODE.D) {
                    this.sideMovement = 0;
                }
                if (_event.code == f.KEYBOARD_CODE.SHIFT_LEFT) {
                    this.avatar.walk();
                }
            }
            onPointerDown(_event) {
                if (this.isLocked) {
                    switch (_event.button) {
                        case 1:
                            this.avatar.shootPush();
                            break;
                        case 2:
                            this.avatar.shootPull();
                            break;
                        default:
                            this.avatar.shootPush();
                            break;
                    }
                }
            }
            pointerLockChange(_event) {
                if (this.isLocked) {
                    this.state = GAMESTATE.MENU;
                }
                this.isLocked = !this.isLocked;
            }
            checkKeyboardInputs() {
                if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
                    this.avatar.jump();
                }
            }
            createAvatar() {
                this.cmpCamera = new f.ComponentCamera();
                this.avatar = new JumpandHook.Avatar(this.cmpCamera, this.config.speed, this.config.jumpforce, this.config.pullForce, this.config.weight, this.config.disableMusic);
                this.root.appendChild(this.avatar);
                this.avatar.setEffectVolume(JumpandHook.uiMenu.effectVolume);
                this.avatar.setMusicVolume(JumpandHook.uiMenu.musicVolume);
            }
            setStartingPlatform() {
                let level = this.root.getChildrenByName("level")[0];
                let firstPlatform = level.getChildrenByName("platform0")[0];
                let cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
                cmpRigid.restitution = 0;
                firstPlatform.addComponent(cmpRigid);
                firstPlatform.getChild(0).addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
                firstPlatform.addComponent(new JumpandHook.ComponentScriptPlatform(0, true, this.config.timeStart, this.config.timeReduction));
            }
            showScores() {
                if (sessionStorage.getItem("highscore"))
                    document.getElementById("highscore").innerHTML = sessionStorage.getItem("highscore");
                if (sessionStorage.getItem("lastscore"))
                    document.getElementById("lastscore").innerHTML = sessionStorage.getItem("lastscore");
            }
            setScores() {
                sessionStorage.setItem("lastscore", this.solvedPlatforms.toString());
                if (sessionStorage.getItem("highscore")) {
                    let highscore = parseInt(sessionStorage.getItem("highscore"));
                    if (this.solvedPlatforms > highscore) {
                        sessionStorage.setItem("highscore", this.solvedPlatforms.toString());
                    }
                }
                else {
                    sessionStorage.setItem("highscore", this.solvedPlatforms.toString());
                }
            }
        }
        Game.graphId = "Graph|2021-04-27T14:37:53.620Z|93013";
        Game.camSpeed = -0.15;
        return Game;
    })();
    JumpandHook.Game = Game;
})(JumpandHook || (JumpandHook = {}));
//# sourceMappingURL=Game.js.map