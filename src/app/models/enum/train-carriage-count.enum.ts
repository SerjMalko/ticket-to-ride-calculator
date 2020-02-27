export class TrainCarriageCountEnum {
  static readonly ONE = new TrainCarriageCountEnum(1, 1);
  static readonly TWO = new TrainCarriageCountEnum(2, 2);
  static readonly THREE = new TrainCarriageCountEnum(3, 4);
  static readonly FOUR = new TrainCarriageCountEnum(4, 7);
  static readonly SIX = new TrainCarriageCountEnum(6, 15);
  static readonly EIGHT = new TrainCarriageCountEnum(8, 21);

  static readonly ALL: Array<TrainCarriageCountEnum> = [
    TrainCarriageCountEnum.ONE,
    TrainCarriageCountEnum.TWO,
    TrainCarriageCountEnum.THREE,
    TrainCarriageCountEnum.FOUR,
    TrainCarriageCountEnum.SIX,
    TrainCarriageCountEnum.EIGHT
  ];

  // private to disallow creating other instances of this type
  private constructor(public readonly carriageCount: number, public readonly value: number) {
  }

  toString() {
    return this.value;
  }
}
