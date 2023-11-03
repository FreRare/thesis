export default class SensorSample {
  private _sampleTime: Date;
  private _temp: Number;
  private _ph: Number;
  private _waterLvl: Number;
  private _lightAmount: Number;

  constructor(sTime = new Date(), temp = 0, ph = 0, water = 0, light = 0) {
    this._sampleTime = sTime;
    this._temp = temp;
    this._ph = ph;
    this._waterLvl = water;
    this._lightAmount = light;
  }

  public get sampleTime(): Date {
    return this._sampleTime;
  }
  public set sampleTime(value: Date) {
    this._sampleTime = value;
  }

  public get temp(): Number {
    return this._temp;
  }
  public set temp(value: Number) {
    this._temp = value;
  }

  public get ph(): Number {
    return this._ph;
  }
  public set ph(value: Number) {
    this._ph = value;
  }

  public get waterLvl(): Number {
    return this._waterLvl;
  }
  public set waterLvl(value: Number) {
    this._waterLvl = value;
  }

  public get lightAmount(): Number {
    return this._lightAmount;
  }
  public set lightAmount(value: Number) {
    this._lightAmount = value;
  }
}
