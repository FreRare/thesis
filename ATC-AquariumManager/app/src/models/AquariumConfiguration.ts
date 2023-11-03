export default class AquariumConfiguration {
  private _id: Number;
  private _minTemp: Number;
  private _maxTemp: Number;
  private _minPh: Number;
  private _maxPh: Number;
  private _OnOutlet1: Number;
  private _OffOutlet1: Number;
  private _OnOutlet2: Number;
  private _OffOutlet2: Number;
  private _OnOutlet3: Number;
  private _OffOutlet3: Number;
  private _waterLvlAlert: Number;
  private _preferredLight: Number;
  private _feedingTime: Number;
  private _foodPortions: Number;
  private _filterClean: Number;
  private _waterChange: Number;
  private _samplePeriod: Number;
  private _lastModifiedDat: Date;

  constructor(
    id = -1,
    minTemp = 0,
    maxTemp = 0,
    minPh = 0,
    maxPh = 0,
    OnO1 = 0,
    OffO1 = 0,
    OnO2 = 0,
    OffO2 = 0,
    OnO3 = 0,
    OffO3 = 0,
    waterLvlAlert = 0,
    prefLight = 0,
    feedingTime = 0,
    foodportions = 0,
    filterClean = 0,
    waterChange = 0,
    samplePer = 0,
    modDate = new Date()
  ) {
    this._id = id;
    this._minTemp = minTemp;
    this._maxTemp = maxTemp;
    this._minPh = minPh;
    this._maxPh = maxPh;
    this._OnOutlet1 = OnO1;
    this._OffOutlet1 = OffO1;
    this._OnOutlet2 = OnO2;
    this._OffOutlet2 = OffO2;
    this._OnOutlet3 = OnO3;
    this._OffOutlet3 = OffO3;
    this._waterLvlAlert = waterLvlAlert;
    this._preferredLight = prefLight;
    this._feedingTime = feedingTime;
    this._foodPortions = foodportions;
    this._filterClean = filterClean;
    this._waterChange = waterChange;
    this._samplePeriod = samplePer;
    this._lastModifiedDat = modDate;
  }

  public get id(): Number {
    return this._id;
  }

  public get minTemp(): Number {
    return this._minTemp;
  }
  public set minTemp(value: Number) {
    this._minTemp = value;
  }

  public get maxTemp(): Number {
    return this._maxTemp;
  }
  public set maxTemp(value: Number) {
    this._maxTemp = value;
  }

  public get minPh(): Number {
    return this._minPh;
  }
  public set minPh(value: Number) {
    this._minPh = value;
  }

  public get maxPh(): Number {
    return this._maxPh;
  }
  public set maxPh(value: Number) {
    this._maxPh = value;
  }

  public get OnOutlet1(): Number {
    return this._OnOutlet1;
  }
  public set OnOutlet1(value: Number) {
    this._OnOutlet1 = value;
  }

  public get OffOutlet1(): Number {
    return this._OffOutlet1;
  }
  public set OffOutlet1(value: Number) {
    this._OffOutlet1 = value;
  }

  public get OnOutlet2(): Number {
    return this._OnOutlet2;
  }
  public set OnOutlet2(value: Number) {
    this._OnOutlet2 = value;
  }

  public get OffOutlet2(): Number {
    return this._OffOutlet2;
  }
  public set OffOutlet2(value: Number) {
    this._OffOutlet2 = value;
  }

  public get OnOutlet3(): Number {
    return this._OnOutlet3;
  }
  public set OnOutlet3(value: Number) {
    this._OnOutlet3 = value;
  }

  public get OffOutlet3(): Number {
    return this._OffOutlet3;
  }
  public set OffOutlet3(value: Number) {
    this._OffOutlet3 = value;
  }

  public get waterLvlAlert(): Number {
    return this._waterLvlAlert;
  }
  public set waterLvlAlert(value: Number) {
    this._waterLvlAlert = value;
  }

  public get preferredLight(): Number {
    return this._preferredLight;
  }
  public set preferredLight(value: Number) {
    this._preferredLight = value;
  }

  public get feedingTime(): Number {
    return this._feedingTime;
  }
  public set feedingTime(value: Number) {
    this._feedingTime = value;
  }

  public get foodPortions(): Number {
    return this._foodPortions;
  }
  public set foodPortions(value: Number) {
    this._foodPortions = value;
  }

  public get filterClean(): Number {
    return this._filterClean;
  }
  public set filterClean(value: Number) {
    this._filterClean = value;
  }

  public get waterChange(): Number {
    return this._waterChange;
  }
  public set waterChange(value: Number) {
    this._waterChange = value;
  }

  public get samplePeriod(): Number {
    return this._samplePeriod;
  }
  public set samplePeriod(value: Number) {
    this._samplePeriod = value;
  }

  public get lastModifiedDat(): Date {
    return this._lastModifiedDat;
  }
  public set lastModifiedDat(value: Date) {
    this._lastModifiedDat = value;
  }
}
