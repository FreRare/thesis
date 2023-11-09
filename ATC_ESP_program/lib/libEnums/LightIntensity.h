#ifndef LightIntensity_h
#define LightIntensity_h
/*-----------------------------------------------
The enum to follow the intensity of light
Used both by config and samples
------------------------------------------------*/
enum LightIntensity : uint8_t {
    DARK = 1,
    SHADY,
    MEDIUM,
    LIGHT,
    BRIGHT,
};

#endif // ! LightIntensity_h