namespace JumpandHook {
  import f = FudgeCore;
  type Config = {
    speed: number;
    jumpforce: number;
    weight: number;
    timeReduction: number;
    debug: boolean;
    disableMusic: boolean;
  };
  export enum GAMESTATE {
    MENU = 0,
    RUNNING = 1
  }
  export class Game {
    private static graphId: string = "Graph|2021-04-27T14:37:53.620Z|93013";
    private static camSpeed: number = -0.15;
    public state: GAMESTATE;
    public solvedPlatforms: number = 0;
    private _canvas: HTMLCanvasElement;
    private _menu: HTMLDivElement;
    private _startButton: HTMLElement;
    private viewport: f.Viewport;
    private cmpCamera: f.ComponentCamera;
    private avatar: Avatar;
    private root: f.Graph = new f.Graph("root");
    // let props: f.Node;
    // const propAmount: number = 12;
    private isLocked: boolean = false;
    private forwardMovement: number = 0;
    private sideMovement: number = 0;
    private config: Config;

    constructor() {
      this.state = GAMESTATE.MENU;
      window.addEventListener("load", this.init.bind(this));
    }
    public get canvas(): HTMLCanvasElement {
      if (!this._canvas) this._canvas = document.getElementById("canvas") as HTMLCanvasElement;
      return this._canvas;
    }

    public get menu(): HTMLDivElement {
      if (!this._menu) this._menu = document.getElementById("menu") as HTMLDivElement;
      return this._menu;
    }

    public get startButton(): HTMLElement {
      if (!this._startButton) this._startButton = document.getElementById("start");
      return this._startButton;
    }

    private async init(): Promise<void> {
      let response: Response = await fetch("Config.json");
      this.config = await response.json();
      await f.Project.loadResourcesFromHTML();
      let resource: f.SerializableResource = f.Project.resources[Game.graphId];
      this.root = <f.Graph>resource;
      let volume: HTMLInputElement = <HTMLInputElement>document.getElementById("volume");
      console.log(volume);

      this.viewport = new f.Viewport();
      this.initPhysics();
      this.createAvatar();
      this.createRigidbodies();
      this.setStartingPlatform();
      this.showScores();
      this.viewport.initialize("Viewport", this.root, this.cmpCamera, this.canvas);
      f.AudioManager.default.listenTo(this.root);
      f.AudioManager.default.listenWith(this.avatar.camNode.getComponent(f.ComponentAudioListener));
      f.Physics.adjustTransforms(this.root, true);
      document.addEventListener("keydown", this.hndKeyDown.bind(this));
      document.addEventListener("keyup", this.hndKeyRelease.bind(this));
      document.addEventListener("mousemove", this.hndMouseMovement.bind(this));
      document.addEventListener("mousedown", this.onPointerDown.bind(this));
      document.addEventListener("pointerlockchange", this.pointerLockChange.bind(this));
      this.startButton.addEventListener("click", this.start);
      volume.addEventListener("input", () => {
        UI.updateVolume();
        this.avatar.setVolume(uiMenu.volume);
      });
      UI.startLive();
    }

    private toggleMenu(): void {
      switch (this.menu.className) {
        case "visible":
          this.menu.className = "hidden";
          break;
        case "hidden":
          this.menu.className = "visible";
          break;
      }
    }

    private start = () => {
      this.canvas.requestPointerLock();
      this.toggleMenu();
      this.state = GAMESTATE.RUNNING;
      f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      f.Loop.start();
    };

    private update = () => {
      switch (this.state) {
        case GAMESTATE.RUNNING:
          f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
          this.checkKeyboardInputs();
          this.avatar.move(this.forwardMovement, this.sideMovement);
          this.avatar.tryGrabLastNode();
          f.AudioManager.default.update();
          this.viewport.draw();
          break;
        case GAMESTATE.MENU:
          f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, this.update);
          f.Loop.stop();
          this.setScores();
          window.location.reload();
          break;
        default:
          window.location.reload();
          break;
      }
    };

    private hndMouseMovement(_event: MouseEvent): void {
      if (this.isLocked) {
        this.avatar.camNode.mtxLocal.rotateY(_event.movementX * Game.camSpeed, true);
        this.avatar.camNode.mtxLocal.rotateZ(_event.movementY * Game.camSpeed);
      }
    }
    private initPhysics(): void {
      f.Physics.initializePhysics();
      f.Physics.world.setSolverIterations(1000);
      f.Physics.settings.defaultRestitution = 0.3;
      f.Physics.settings.defaultFriction = 0.8;
      f.Physics.settings.debugDraw = this.config.debug;
    }
    private hndKeyDown(_event: KeyboardEvent): void {
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

    private hndKeyRelease(_event: KeyboardEvent): void {
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

    private onPointerDown(_event: MouseEvent): void {
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

    private pointerLockChange(_event: Event): void {
      if (this.isLocked) this.state = GAMESTATE.MENU;
      this.isLocked = !this.isLocked;
    }

    private checkKeyboardInputs(): void {
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
        this.avatar.jump();
      }
    }

    private createAvatar(): void {
      this.cmpCamera = new f.ComponentCamera();
      this.avatar = new Avatar(this.cmpCamera, this.config.speed, this.config.jumpforce, this.config.weight, this.config.disableMusic);
      this.root.appendChild(this.avatar);
      this.avatar.setVolume(uiMenu.volume);
    }

    private setStartingPlatform(): void {
      let level: f.Node = this.root.getChildrenByName("level")[0];
      let firstPlatform: f.Node = level.getChildrenByName("platform0")[0];
      firstPlatform.addComponent(new ComponentScriptPlatform(0, true, this.config.timeReduction));
    }

    private createRigidbodies(): void {
      let level: f.Node = this.root.getChildrenByName("level")[0];
      let cmpRigid: f.ComponentRigidbody;
      for (let node of level.getChildren()) {
        if (node.getChildren().length != 0) {
          for (let child of node.getChildren()) {
            this.addRigidBasedOnMesh(child);
          }
        }
        this.addRigidBasedOnMesh(node);
      }
      let ball: f.Node = this.root.getChildrenByName("ball")[0];
      cmpRigid = new f.ComponentRigidbody(7, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE, f.PHYSICS_GROUP.DEFAULT);
      ball.addComponent(cmpRigid);
      ball.addComponent(new ComponentScriptProp());
    }

    private addRigidBasedOnMesh(node: f.Node): void {
      if (!node.getComponent(f.ComponentRigidbody)) {
        let cmpRigid: f.ComponentRigidbody;
        switch (node.getComponent(f.ComponentMesh).mesh.name) {
          case "meshCube":
            cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
            cmpRigid.restitution = 0;
            break;
          case "meshExtrusion":
            cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
            break;
          case "meshSphere":
            cmpRigid = new f.ComponentRigidbody(7, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE, f.PHYSICS_GROUP.DEFAULT);
            break;
          default:
            cmpRigid = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);

            break;
        }
        node.addComponent(cmpRigid);
      }
    }
    private showScores(): void {
      if (localStorage.getItem("highscore")) document.getElementById("highscore").innerHTML = localStorage.getItem("highscore");
      if (localStorage.getItem("lastscore")) document.getElementById("lastscore").innerHTML = localStorage.getItem("lastscore");
    }

    private setScores(): void {
      localStorage.setItem("lastscore", this.solvedPlatforms.toString());
      if (localStorage.getItem("highscore")) {
        let highscore: number = parseInt(localStorage.getItem("highscore"));
        if (this.solvedPlatforms > highscore) {
          localStorage.setItem("highscore", this.solvedPlatforms.toString());
        }
      } else {
        localStorage.setItem("highscore", this.solvedPlatforms.toString());
      }
    }
  }
}
