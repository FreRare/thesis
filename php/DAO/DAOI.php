<?php

interface AQDAOI
{
    function __query(string $sql);
    function selectUserByEmail(string $email);
    function createUser(User $user): bool;
    function deleteUser(User $user): bool;
    function updateUser(User $user, string $email): bool;
    function selectAquariumById(int $id);
    function createAquarium(Aquarium $quarium);
    function deleteAquarium(Aquarium $quarium): bool;
    function updateAquarium(Aquarium $quarium): bool;
    function selectAQConfigForAquarium(int $id);
    function createAQConfig(AQConfig $AQConfig): bool;
    function updateAQConfig(AQConfig $AQConfig): bool;
    function deleteAQConfig(AQConfig $AQConfig): bool;
    function selectSensorSamplesForAquarium(int $id): array;
    function createSensorSample(SensorSample $sensorSample): bool;
    function updateSensorSample(SensorSample $sample): bool;
    function deleteSensorSample(SensorSample $sample): bool;
}