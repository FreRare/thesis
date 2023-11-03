import AquariumConfiguration from "./AquariumConfiguration";
import SensorSample from "./SensorSample";

/**
 * The class to represent an Aquarium
 */
export default class Aquarium {
  private _id: Number;
  private _name: string;
  private _length: Number;
  private _height: Number;
  private _width: Number;
  private _config: AquariumConfiguration;
  private _samples: Array<SensorSample>;

  constructor(
    id: Number = -1,
    name = "My Aquarium",
    length = 60,
    height = 30,
    width = 30,
    config = new AquariumConfiguration(),
    samples = []
  ) {
    this._id = id;
    this._name = name;
    this._length = length;
    this._height = height;
    this._width = width;
    this._config = config;
    this._samples = samples;
  }

  public get id(): Number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
  public set name(value: string) {
    this._name = value;
  }

  public get length(): Number {
    return this._length;
  }
  public set length(value: Number) {
    this._length = value;
  }

  public get height(): Number {
    return this._height;
  }
  public set height(value: Number) {
    this._height = value;
  }

  public get width(): Number {
    return this._width;
  }
  public set width(value: Number) {
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
}
