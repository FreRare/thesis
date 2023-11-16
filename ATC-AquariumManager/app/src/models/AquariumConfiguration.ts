export default class AquariumConfiguration {
  private _id: number;
  private _minTemp: number;
  private _maxTemp: number;
  private _minPh: number;
  private _maxPh: number;
  private _OnOutlet1: number;
  private _OffOutlet1: number;
  private _OnOutlet2: number;
  private _OffOutlet2: number;
  private _OnOutlet3: number;
  private _OffOutlet3: number;
  private _waterLvlAlert: number;
  private _feedingTime: number;
  private _foodPortions: number;
  private _filterClean: number;
  private _waterChange: number;
  private _samplePeriod: number;
  private _lastModifiedDate: Date;

  constructor(
    id = -1,
    minTemp = 23.5, // input
    maxTemp = 28.0, // input-
    minPh = 6.0, // input
    maxPh = 8.0, // input-
    OnO1 = 480, // 8:00
    OffO1 = 1200, // 20:00
    OnO2 = 480, // timepick
    OffO2 = 1200, // timepick-
    OnO3 = 480, // timepick
    OffO3 = 1200, // timepick-
    waterLvlAlert = 75, //input
    feedingTime = 660, // timepick
    foodportions = 1, // input-
    filterClean = 0, // dropdown
    waterChange = 0, // dropdown-
    samplePer = 2, // dropdown
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
    this._feedingTime = feedingTime;
    this._foodPortions = foodportions;
    this._filterClean = filterClean;
    this._waterChange = waterChange;
    this._samplePeriod = samplePer;
    this._lastModifiedDate = modDate;
  }

  public get id(): number {
    return this._id;
  }

  public get minTemp(): number {
    return this._minTemp;
  }
  public set minTemp(value: number) {
    this._minTemp = value;
  }

  public get maxTemp(): number {
    return this._maxTemp;
  }
  public set maxTemp(value: number) {
    this._maxTemp = value;
  }

  public get minPh(): number {
    return this._minPh;
  }
  public set minPh(value: number) {
    this._minPh = value;
  }

  public get maxPh(): number {
    return this._maxPh;
  }
  public set maxPh(value: number) {
    this._maxPh = value;
  }

  public get OnOutlet1(): number {
    return this._OnOutlet1;
  }
  public set OnOutlet1(value: number) {
    this._OnOutlet1 = value;
  }

  public get OffOutlet1(): number {
    return this._OffOutlet1;
  }
  public set OffOutlet1(value: number) {
    this._OffOutlet1 = value;
  }

  public get OnOutlet2(): number {
    return this._OnOutlet2;
  }
  public set OnOutlet2(value: number) {
    this._OnOutlet2 = value;
  }

  public get OffOutlet2(): number {
    return this._OffOutlet2;
  }
  public set OffOutlet2(value: number) {
    this._OffOutlet2 = value;
  }

  public get OnOutlet3(): number {
    return this._OnOutlet3;
  }
  public set OnOutlet3(value: number) {
    this._OnOutlet3 = value;
  }

  public get OffOutlet3(): number {
    return this._OffOutlet3;
  }
  public set OffOutlet3(value: number) {
    this._OffOutlet3 = value;
  }

  public get waterLvlAlert(): number {
    return this._waterLvlAlert;
  }
  public set waterLvlAlert(value: number) {
    this._waterLvlAlert = value;
  }

  public get feedingTime(): number {
    return this._feedingTime;
  }
  public set feedingTime(value: number) {
    this._feedingTime = value;
  }

  public get foodPortions(): number {
    return this._foodPortions;
  }
  public set foodPortions(value: number) {
    this._foodPortions = value;
  }

  public get filterClean(): number {
    return this._filterClean;
  }
  public set filterClean(value: number) {
    this._filterClean = value;
  }

  public get waterChange(): number {
    return this._waterChange;
  }
  public set waterChange(value: number) {
    this._waterChange = value;
  }

  public get samplePeriod(): number {
    return this._samplePeriod;
  }
  public set samplePeriod(value: number) {
    this._samplePeriod = value;
  }

  public get lastModifiedDat(): Date {
    return this._lastModifiedDate;
  }
  public set lastModifiedDat(value: Date) {
    this._lastModifiedDate = value;
  }

  /**
   * Convert the given number from minutes to 24h format clock
   * @param dat the time in minutes (between 0 and 1439)
   */
  static convertMinutesToTimeString = (dat: number) => {
    if (dat >= 1440) {
      dat = 0;
    }
    // Calculate minutes and hours
    const minutes = dat % 60;
    dat -= minutes;
    const hours = dat / 60;
    return (
      String(hours > 9 ? hours : "0" + hours) +
      ":" +
      String(minutes > 9 ? minutes : "0" + minutes)
    );
  };
}
