export class GameStatusEnum {
  static readonly CREATE = new GameStatusEnum('create');
  static readonly CURRENT = new GameStatusEnum('current');
  static readonly COMPLETE = new GameStatusEnum('complete');
  static readonly LEAVE = new GameStatusEnum('leave');


  // private to disallow creating other instances of this type
  private constructor(public readonly value: string) {
  }

  toString() {
    return this.value;
  }
}
