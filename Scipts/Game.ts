namespace JumpandHook {
  import f = FudgeCore;
  type Config = {
    speed: number;
    jumpforce: number;
    pullForce: number;
    weight: number;
    timeStart: number;
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
      let response: Response = await fetch(Utils.path() + "../config.json");
      this.config = await response.json();
      await f.Project.loadResourcesFromHTML();
      let resource: f.SerializableResource = f.Project.resources[Game.graphId];
      this.root = <f.Graph>resource;
      let effectVolume: HTMLInputElement = <HTMLInputElement>document.getElementById("effectVolume");
      let musicVolume: HTMLInputElement = <HTMLInputElement>document.getElementById("musicVolume");
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
        UI.updateVolume();
        this.avatar.setEffectVolume(uiMenu.effectVolume);
      });
      musicVolume.addEventListener("input", () => {
        UI.updateVolume();
        this.avatar.setMusicVolume(uiMenu.musicVolume);
      });
      UI.updateLive();
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
      this.setStartingPlatform();
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
          if (f.AudioManager.default.getGraphListeningTo()) {
            f.AudioManager.default.update();
          }
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
      if (this.isLocked) {
        this.state = GAMESTATE.MENU;
      }
      this.isLocked = !this.isLocked;
    }

    private checkKeyboardInputs(): void {
      if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
        this.avatar.jump();
      }
    }

    private createAvatar(): void {
      this.cmpCamera = new f.ComponentCamera();
      this.avatar = new Avatar(this.cmpCamera, this.config.speed, this.config.jumpforce, this.config.pullForce, this.config.weight, this.config.disableMusic);
      this.root.appendChild(this.avatar);
      this.avatar.setEffectVolume(uiMenu.effectVolume);
      this.avatar.setMusicVolume(uiMenu.musicVolume);
    }

    private setStartingPlatform(): void {
      let level: f.Node = this.root.getChildrenByName("level")[0];
      let firstPlatform: f.Node = level.getChildrenByName("platform0")[0];
      let cmpRigid: f.ComponentRigidbody = new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT);
      cmpRigid.restitution = 0;
      firstPlatform.addComponent(cmpRigid);
      firstPlatform.getChild(0).addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
      firstPlatform.addComponent(new ComponentScriptPlatform(0, true, this.config.timeStart, this.config.timeReduction));
    }
    private showScores(): void {
      if (sessionStorage.getItem("highscore")) document.getElementById("highscore").innerHTML = sessionStorage.getItem("highscore");
      if (sessionStorage.getItem("lastscore")) document.getElementById("lastscore").innerHTML = sessionStorage.getItem("lastscore");
    }

    private setScores(): void {
      sessionStorage.setItem("lastscore", this.solvedPlatforms.toString());
      if (sessionStorage.getItem("highscore")) {
        let highscore: number = parseInt(sessionStorage.getItem("highscore"));
        if (this.solvedPlatforms > highscore) {
          sessionStorage.setItem("highscore", this.solvedPlatforms.toString());
        }
      } else {
        sessionStorage.setItem("highscore", this.solvedPlatforms.toString());
      }
    }
  }
}
