import AquariumConfiguration from "./AquariumConfiguration";
import SensorSample from "./SensorSample";

/**
 * The class to represent an Aquarium
 */
export default class Aquarium {
  private _id: number;
  private _name: string;
  private _length: number;
  private _height: number;
  private _width: number;
  private _fishCount: number;
  private _config: AquariumConfiguration;
  private _samples: Array<SensorSample>;

  constructor(
    id: number = -1,
    name = "My Aquarium",
    length = 60,
    height = 30,
    width = 30,
    fishCount = 10,
    config = new AquariumConfiguration(),
    samples = []
  ) {
    this._id = id;
    this._name = name;
    this._length = length;
    this._height = height;
    this._width = width;
    this._fishCount = fishCount;
    this._config = config;
    this._samples = samples;
  }

  public get id(): number {
    return this._id;
  }

  public set id(id: number) {
    this._id = id;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get length(): number {
    return this._length;
  }
  public set length(value: number) {
    this._length = value;
  }

  public get height(): number {
    return this._height;
  }
  public set height(value: number) {
    this._height = value;
  }

  public get width(): number {
    return this._width;
  }
  public set width(value: number) {
    this._width = value;
  }

  public get config(): AquariumConfiguration {
    return this._config;
  }
  public set config(value: AquariumConfiguration) {
    this._config = value;
  }

  public get samples(): Array<SensorSample> {
    return this._samples;
  }
  public set samples(value: Array<SensorSample>) {
    this._samples = value;
  }

  public get fishCount(): number {
    return this._fishCount;
  }
  public set fishCount(value: number) {
    this._fishCount = value;
  }
}
