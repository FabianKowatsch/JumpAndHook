namespace JumpandHook {
  import f = FudgeCore;
  import fUi = FudgeUserInterface;
  export class LiveUi extends f.Mutable {
    public score: number = 0;
    protected reduceMutator(_mutator: f.Mutator): void {
      return;
    }
  }
  export class MenuUi extends f.Mutable {
    public volume: number = 20;
    protected reduceMutator(_mutator: f.Mutator): void {
      return;
    }
  }
  export let uiLive: LiveUi = new LiveUi();
  export let uiMenu: MenuUi = new MenuUi();
  export class UI {
    private static controllerLive: fUi.Controller;
    public static startLive(): void {
      let ui: HTMLDivElement = <HTMLDivElement>document.getElementById("ui");
      UI.controllerLive = new fUi.Controller(uiLive, ui);
      UI.controllerLive.updateUserInterface();
    }
    public static updateVolume(): void {
      let ui: HTMLDivElement = <HTMLDivElement>document.getElementById("options");
      fUi.Controller.updateMutator(ui, uiMenu);
      console.log(uiMenu.volume);
    }
  }
}
