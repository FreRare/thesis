<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAOI.php");
require_once($_SERVER["DOCUMENT_ROOT"] . '/DAO/Config/DBConfig.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/User.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/Aquarium.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/SensorSample.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/AQConfig.php');


/**
 * Data access object
 * Pefroms all queries and db interactions
 */
class AQDAO implements AQDAOI
{
    private static $instance = null;
    private $connection = null;
    private $config = null;
    private const createUser = "INSERT INTO users (email, fistName, lastName, password) VALUES (?, ?, ?, ?)";
    private const deleteUser = "DELETE FROM users WHERE email = ?";
    private function __construct()
    {
        $this->config = new DBConfig();
        $this->connection = new mysqli(
            $this->config->getHost("DAO"),
            $this->config->getUser("DAO"),
            $this->config->getPassword("DAO"),
            $this->config->getDatabase("DAO"),
            $this->config->getPort("DAO")
        );
        if (!$this->connection || mysqli_connect_error()) {
            die("Connection failed!!!" . mysqli_connect_error());
        } else {
            try {
                if ($this->connection->query("USE " . $this->config->getDatabase("DAO"))) {
                    echo ("Using DB " . $this->config->getDatabase("DAO"));
                }
            } catch (Error $e) {
                echo ("Error while connecting => " . $this->connection->error);
            }
        }
    }
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    /**
     * Executes the given string to the DB
     * @param string $queryString
     * @return mixed the result of the query
     */
    public function __query(string $queryString = "")
    {
        if($queryString == ""){
            return false;
        }
        $res = $this->connection->query($queryString);
        if (!$res) {
            return $this->connection->error;
        } else {
            return $res;
        }
    }

    function createUser(User $user) : bool { return false; }
    function deleteUser(User $user) : bool { return false; }
    function deleteUserByEmail(string $email) : bool { return false; }
    function updateUser(User $user) : bool { return false; }
    function createAquarium(Aquarium $quarium) : bool { return false; }
    function deleteAquarium(Aquarium $quarium) : bool { return false; }
    function deleteAquariumById(int $id) : bool { return false; }
    function updateAquarium(Aquarium $quarium) : bool { return false; }
    function createAQConfig(AQConfig $config) : bool { return false; }
    function updateAQConfig(AQConfig $config) : bool { return false; }
    function deleteAQConfigById(int $id) : bool { return false; }
    function deleteAQConfig(AQConfig $config) : bool { return false; }
    function createSensorSample(SensorSample $sensorSample) : bool { return false; }
    function deleteSensorSampleById(int $id) : bool { return false; }
    function updateSensorSample(SensorSample $sample) : bool { return false; }
    function deleteSensorSample(SensorSample $sample) : bool { return false; }
}