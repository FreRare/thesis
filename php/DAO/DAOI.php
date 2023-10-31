<?php

interface AQDAOI
{
    /**
     * To create an instance of this class
     * Usage is only possible trought the instance returned by this function
     * @return AQDAO
     */
    static function getInstance() : AQDAO;
       /**
     * Executes the given string to the DB
     * @param string $queryString
     * @return mixed the result of the query
     */
    function __query(string $sql);
        /**
     * Selects all users with the given email from the DB (should be only one)
     * @param string $email
     * @return User|null
     */
    function selectUserByEmail(string $email);

    /**
     * Selects a user by it's login token
     * @param string $token The user's token
     * @return User | null The user if found null otherwise
     */
    function selectUserByToken(string $token);

    /**
     * Creates a user in the DB from the given Object
     * @param User $userToCreate
     * @return bool True on success
     */
    function createUser(User $user): bool;
    /**
     * Deletes th euser from the DB identified by the given object
     * @param User $userToDelete
     * @return bool True on success
     */
    function deleteUser(User $user): bool;
    /**
     * Updates the user with the given email address to the Object given
     * @param User $user
     * @param string $oldEmail
     * @return bool True on success
     */
    function updateUser(User $user, string $email): bool;
    /**
     * Finds the aquarium with the ID provided, and return it as an Aquarium object
     * @param int $id
     * @return Aquarium | null
     */
    function selectAquariumById(int $id);
    /**
     * Inserts an Aquarium into the DB based on the given object
     * @param Aquarium $obj
     * @return Aquarium | null The created Aquarium with it's generated ID or null on failure
     */
    function createAquarium(Aquarium $quarium);
    /**
     * Deletes the aquarium from the DB located based on the given object
     * @param Aquarium $obj
     * @return bool True on success
     */
    function deleteAquarium(Aquarium $quarium): bool;
    /**
     * Updates the Aquarium identified by the given object to the given object (ID stays the same)
     * @param Aquarium $obj
     * @return bool True on success
     */
    function updateAquarium(Aquarium $quarium): bool;
    /**
     * Selects the configuration for the Aquarium with the given id
     * @param int $id
     * @return AQConfig | null The found data as an object or null
     */
    function selectAQConfigForAquarium(int $id);
    /**
     * Creates a configuration in the DB based on the given Object
     * @param AQCOnfig $obj
     * @return bool True on success
     */
    function createAQConfig(AQConfig $AQConfig): bool;
    /**
     * Updates the Configuration based on the given object (ID stays the same)
     * @param AQConfig $obj
     * @return bool True on success
     */
    function updateAQConfig(AQConfig $AQConfig): bool;
    /**
     * Deletes the Configuration identified by the given object
     * @param AQConfig $obj
     * @return bool True on success
     */
    function deleteAQConfig(AQConfig $AQConfig): bool;
    /**
     * Gets all the samples for the aquarium identified by the given id
     * It creates SensorSample objects from the datas
     * @param int $id
     * @return array<SensorSample> The samples as an array
     */
    function selectSensorSamplesForAquarium(int $id): array;
    /**
     * Uploads the provided sample to the database
     * @param SensorSample $obj
     * @return bool True on success
     */
    function createSensorSample(SensorSample $sensorSample): bool;
    /**
     * Updates the provided sample by the object given (ID and DATE stays the same)
     * @param SensorSample $obj
     * @return bool True on success
     */
    function updateSensorSample(SensorSample $sample): bool;
    /**
     * Deletes the provided sample from the DB
     * @param SensorSample $obj
     * @return bool True on success
     */
    function deleteSensorSample(SensorSample $sample): bool;
    /**
     * Creates the connection between the user and the aquarium in the database
     * @param User $user
     * @param int $id
     * @return bool True on success
     */
    function createAquariumConnection(User $user, Aquarium $quarium): bool;
    /**
     * Selects the Aquariums connected to the provided user
     * @param User $user
     * @return array<Aquarium> The found Aquarium objects as an array
     */
    function selectUserAquariums(User $user): array;
    /**
     * Deletes the connection based on the aquarium
     * @param Aquarium $obj
     * @return bool True on success
     */
    function deleteAquariumConnectionByAquarium(Aquarium $aq): bool;
    /**
     * Deletes the connection based on the provided user
     * @param User $user
     * @return bool True on success
     */
    function deleteAquariumConnectionByUser(User $user): bool;
}