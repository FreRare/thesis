<?php

interface AQDAOI{
    function __query(string $sql);
    function createUser(User $user) : bool;
    function deleteUser(User $user) : bool;
    function deleteUserByEmail(string $email) : bool;
    function updateUser(User $user) : bool;
    function createAquarium(Aquarium $quarium) : bool;
    function deleteAquarium(Aquarium $quarium) : bool;
    function deleteAquariumById(int $id) : bool;
    function updateAquarium(Aquarium $quarium) : bool;
    function createAQConfig(AQConfig $AQConfig) : bool;
    function updateAQConfig(AQConfig $AQConfig) : bool;
    function deleteAQConfigById(int $id) : bool;
    function deleteAQConfig(AQConfig $AQConfig) : bool;
    function createSensorSample(SensorSample $sensorSample) : bool;
    function updateSensorSample(SensorSample $sample) : bool;
    function deleteSensorSample(SensorSample $sample) : bool;
}