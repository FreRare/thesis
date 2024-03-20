export default class SensorSample {
  private _sampleTime: Date;
  private _temp: number;
  private _ph: number;
  private _waterLvl: number;
  private _lightAmount: number;

  constructor(sTime = new Date(), temp = 0, ph = 0, water = 0, light = 1) {
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

  public get temp(): number {
    return this._temp;
  }
  public set temp(value: number) {
    this._temp = value;
  }

  public get ph(): number {
    return this._ph;
  }
  public set ph(value: number) {
    this._ph = value;
  }

  public get waterLvl(): number {
    return this._waterLvl;
  }
  public set waterLvl(value: number) {
    this._waterLvl = value;
  }

  public get lightAmount(): number {
    return this._lightAmount;
  }
  public set lightAmount(value: number) {
    this._lightAmount = value;
  }
}
