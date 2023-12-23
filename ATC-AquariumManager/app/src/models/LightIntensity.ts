enum LightIntensity {
  DARK = 1,
  SHADY = 2,
  MEDIUM = 3,
  LIGHT = 4,
  BRIGHT = 5,
}

const LightIntensityToString = (val: number) => {
  switch (val) {
    case LightIntensity.DARK:
      return "Dark";
    case LightIntensity.SHADY:
      return "Shady";
    case LightIntensity.MEDIUM:
      return "Medium";
    case LightIntensity.LIGHT:
      return "Light";
    case LightIntensity.BRIGHT:
      return "Bright";
    default:
      return "";
  }
};

export { LightIntensityToString, LightIntensity };
