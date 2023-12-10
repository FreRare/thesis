<?php
/**
 * This class stores the error codes that can be encountered on th ESP
 * The errors have the same codes as the ones on the ESP
 */
class ErrorCodes
{
    static const ERROR_GENERAL = 255;
    static const ERROR_LOW_TEMP = 1;
    static const ERROR_HIGH_TEMP = 2;
    static const ERROR_LOW_PH = 3;
    static const ERROR_HIGH_PH = 4;
    static const ERROR_LOW_WATER = 5;
    static const ERROR_BROKEN_LIGHT = 14;
    static const ERROR_SENSOR_SAMPLE = 33;

    public function getErrorString(int $errorCode): string
    {
        switch ($errorCode) {
            case ErrorCodes::ERROR_GENERAL:
                return "An unexpected error occured!";
            case ErrorCodes::ERROR_LOW_TEMP:
                return "Low temperature measured in the aquarium!";
            case ErrorCodes::ERROR_HIGH_TEMP:
                return "High temperature measured in the aquarium!";
            case ErrorCodes::ERROR_LOW_PH:
                return "Low Ph level measure in the aquarium!";
            case ErrorCodes::ERROR_HIGH_PH:
                return "High Ph level measured in the aquarium!";
            case ErrorCodes::ERROR_LOW_WATER:
                return "Water level fell below the preferred value!";
            case ErrorCodes::ERROR_BROKEN_LIGHT:
                return "The light in your aquarium seems to be darker than expected, make sure it's not broken!";
            case ErrorCodes::ERROR_SENSOR_SAMPLE:
                return "An Error occured while measuring the sensors!";
            default:
                return "An unknown Error occured!";
        }
    }
}