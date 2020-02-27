const colorList = {
  colorRed: 'red',
  colorBlue: 'blue',
  colorGreen: 'green',
  colorYellow: 'yellow',
  colorBlack: 'black'
};

export class CarriageColorEnum {
  static readonly RED = new CarriageColorEnum(colorList.colorRed, 1);
  static readonly BLUE = new CarriageColorEnum(colorList.colorBlue, 2);
  static readonly GREEN = new CarriageColorEnum(colorList.colorGreen, 3);
  static readonly BLACK = new CarriageColorEnum(colorList.colorBlack, 4);
  static readonly YELLOW = new CarriageColorEnum(colorList.colorYellow, 5);


  static readonly ALL: Array<CarriageColorEnum> = [
    CarriageColorEnum.BLACK,
    CarriageColorEnum.BLUE,
    CarriageColorEnum.GREEN,
    CarriageColorEnum.RED,
    CarriageColorEnum.YELLOW
  ];

  // private to disallow creating other instances of this type
  private constructor(public readonly colorHash: string, public readonly id: number) {
  }

  toString() {
    return this.id;
  }
}
