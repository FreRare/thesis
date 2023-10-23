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
    private const CREATE_USER = "INSERT INTO users (email, fistName, lastName, password) VALUES (?, ?, ?, ?)";
    private const DELETE_USER = "DELETE FROM users WHERE email = ?";
    private const SELECT_USER_BY_EMAIL = "SELECT * FROM users WHERE email = ?";
    private const UPDATE_USER = "UPDATE users SET email = ?, password = ?, firstName = ?, lastName = ? WHERE email = ?";
    const SELECT_AQUARIUM = "SELECT * FROM aquariums WHERE id = ?";
    const CREATE_AQUARIUM = "INSERT INTO aquariums (name, length, height, width) VALUES (?, ?, ?, ?)";
    const DELETE_AQUARIUM = "DELETE FROM aquariums WHERE id = ?";
    const UPDATE_AQUARIUM = "UPDATE aquariums SET name = ?, length = ?, height = ?, width = ? WHERE id = ?";
    const SELECT_CONFIG_FOR_AQUARIUM = "SELECT * FROM configs WHERE id = ?";
    const CREATE_CONFIG = "INSERT INTO configs (id, minTemp, maxTemp, minPh, maxPh, lightOn, lightOff, filterOn, filterOff, airOn, airOff, waterLvlAlert, prefLight, feedingTime, foodPortions, filterClean, waterChange, samplePeriod, lastModifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const DELETE_CONFIG = "DELETE FROM configs WHERE id = ?";
    const UPDATE_CONFIG = "UPDATE configs SET minTemp = ?, maxTemp = ?, minPh = ?, maxPh = ?, lightOn = ?, lightOff = ?, filterOn = ?, filterOff = ?, airOn = ?, airOff = ?, waterLvlAlert = ?, prefLight = ?, feedingTime = ?, foodPortions = ?, filterClean = ?, waterChange = ?, samplePeriod = ?, lastModifiedDate = ? WHERE id = ?";
    const SELECT_SENSOR_SAMPLES_FOR_AQUARIUM = "SELECT * FROM sensorSamples WHERE id = ?";
    const SELECT_SENSOR_SAMPLES_FOR_AQUARIUM_IN_RANGE = "SELECT * FROM sensorSamples WHERE id = ? AND sampleTime >= ? AND sampleTime <= ?";
    const CREATE_SENSOR_SAMPLE = "INSERT INTO sensorSamples (id, sampleTime, temp, ph, waterLvl, lightAmount) VALUES (?, ?, ?, ?, ?, ?)";
    const DELETE_SENSOR_SAMPLE = "DELETE FROM sensorSamples WHERE id = ?";
    const UPDATE_SENSOR_SAMPLE = "UPDATE sensorSamples SET sampleTime = ?, temp = ?, ph = ?, waterLvl = ?, lightAmount = ? WHERE id = ?";
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
        if ($queryString == "") {
            return false;
        }
        $res = $this->connection->query($queryString);
        if (!$res) {
            return $this->connection->error;
        } else {
            return $res;
        }
    }

    function selectUserByEmail(string $email)
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_USER_BY_EMAIL);
        $stm->bind_param("s", $email);
        $stm->bind_result($mail, $pass, $fname, $lname);
        $stm->fetch();
        $stm->close();
        if (empty($mail) || empty($pass) || empty($fname) || empty($lname)) {
            return null;
        } else {
            return new User($mail, $pass, $fname, $lname);
        }
    }

    function createUser(User $user): bool
    {
        if (!$user instanceof User) {
            return false;
        }
        $statement = $this->connection->prepare(AQDAO::CREATE_USER);
        $email = $user->getEmail();
        $pass = $user->getPassword();
        $fName = $user->getFirstName();
        $lName = $user->getLastName();
        $statement->bind_param("ssss", $email, $pass, $fName, $lName);

        $success = $statement->execute();
        $statement->close();
        return $success;
    }
    function deleteUser(User $user): bool
    {
        if (!$user instanceof User) {
            return false;
        }
        $stm = $this->connection->prepare(AQDAO::DELETE_USER);
        $email = $user->getEmail();
        $stm->bind_param("s", $email);
        $success = $stm->execute();
        return $success;
    }
    function updateUser(User $user, string $email): bool
    {
        if (!$user instanceof User) {
            return false;
        }
        $stm = $this->connection->prepare(AQDAO::UPDATE_USER);
        $newMail = $user->getEmail();
        $newPass = $user->getPassword();
        $newFname = $user->getFirstName();
        $newLname = $user->getLastName();
        $stm->bind_param("sssss", $newMail, $newPass, $newFname, $newLname, $email);
        $success = $stm->execute();
        return $success;
    }
    function selectAquariumById(int $id)
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_AQUARIUM);
        $stm->bind_param("i", $id);
        $stm->bind_result($id, $name, $length, $height, $width);
        $stm->execute();
        $stm->close();
        if (empty($id) || empty($name) || empty($length) || empty($height) || empty($width)) {
            return null;
        } else {
            return new Aquarium($id, $name, $length, $height, $width);
        }
    }

    function createAquarium(Aquarium $aquarium)
    {
        $stm = $this->connection->prepare(AQDAO::CREATE_AQUARIUM);
        $name = $aquarium->getName();
        $length = $aquarium->getLength();
        $height = $aquarium->getHeight();
        $width = $aquarium->getWidth();
        $stm->bind_param("siii", $name, $length, $height, $width);
        $success = $stm->execute();
        $newId = $stm->insert_id;
        $stm->close();
        if ($success) {
            return new Aquarium($newId, $name, $length, $height, $width);
        } else {
            return null;
        }
    }

    function deleteAquarium(Aquarium $aquarium): bool
    {
        $stm = $this->connection->prepare(AQDAO::DELETE_AQUARIUM);
        $id = $aquarium->getId();
        $stm->bind_param("i", $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function updateAquarium(Aquarium $aquarium): bool
    {
        $stm = $this->connection->prepare(AQDAO::UPDATE_AQUARIUM);
        $name = $aquarium->getName();
        $length = $aquarium->getLength();
        $height = $aquarium->getHeight();
        $width = $aquarium->getWidth();
        $id = $aquarium->getId();
        $stm->bind_param("siiii", $name, $length, $height, $width, $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }
    function selectAQConfigForAquarium(int $id)
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_CONFIG_FOR_AQUARIUM);
        $stm->bind_param("i", $id);
        $stm->bind_result($id, $minT, $maxT, $minP, $maxP, $liOn, $liOff, $filOn, $filOff, $airOn, $airOff, $wAlert, $prefLi, $feedT, $foodPort, $filC, $waterC, $samplePeriod, $lModDate);
        $stm->execute();
        $stm->close();
        if (empty($id) || empty($minT) || empty($maxT) || empty($minP) || empty($maxPh) || empty($liOn) || empty($liOff) || empty($filOn) || empty($filOff) || empty($airOn) || empty($airOff) || empty($wAlert) || empty($prefLi) || empty($feedT) || empty($foodPort) || empty($filC) || empty($waterC) || empty($samplePeriod) || empty($lModDate)) {
            return null;
        } else {
            return new AQConfig($id, $minT, $maxT, $minP, $maxP, $liOn, $liOff, $filOn, $filOff, $airOn, $airOff, $wAlert, $prefLi, $feedT, $foodPort, $filC, $waterC, $samplePeriod, $lModDate);
        }
    }

    function createAQConfig(AQConfig $aqConfig): bool
    {
        $stm = $this->connection->prepare(AQDAO::CREATE_CONFIG);
        $aquariumId = $aqConfig->getAquariumId();
        $minTemp = $aqConfig->getMinTemp();
        $maxTemp = $aqConfig->getMaxTemp();
        $minPh = $aqConfig->getMinPh();
        $maxPh = $aqConfig->getMaxPh();
        $lightOn = $aqConfig->getLightOn();
        $lightOff = $aqConfig->getLightOff();
        $filterOn = $aqConfig->getFilterOn();
        $filterOff = $aqConfig->getFilterOff();
        $airOn = $aqConfig->getAirOn();
        $airOff = $aqConfig->getAirOff();
        $waterLvlAlert = $aqConfig->getWaterLvlAlert();
        $prefLight = $aqConfig->getPrefLight();
        $feedingTime = $aqConfig->getFeedingTime();
        $foodPortions = $aqConfig->getFoodPortions();
        $filterClean = $aqConfig->getFilterClean();
        $waterChange = $aqConfig->getWaterChange();
        $samplePeriod = $aqConfig->getSamplePeriod();
        $lastModifiedDate = $aqConfig->getLastModifiedDate()->format('Y-m-d H:i:s');

        $stm->bind_param("iiissiiiiiiiiiiiis", $aquariumId, $minTemp, $maxTemp, $minPh, $maxPh, $lightOn, $lightOff, $filterOn, $filterOff, $airOn, $airOff, $waterLvlAlert, $prefLight, $feedingTime, $foodPortions, $filterClean, $waterChange, $samplePeriod, $lastModifiedDate);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function deleteAQConfig(AQConfig $aqConfig): bool
    {
        $stm = $this->connection->prepare(AQDAO::DELETE_CONFIG);
        $id = $aqConfig->getAquariumId();
        $stm->bind_param("i", $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function updateAQConfig(AQConfig $aqConfig): bool
    {
        $stm = $this->connection->prepare(AQDAO::UPDATE_CONFIG);
        $minTemp = $aqConfig->getMinTemp();
        $maxTemp = $aqConfig->getMaxTemp();
        $minPh = $aqConfig->getMinPh();
        $maxPh = $aqConfig->getMaxPh();
        $lightOn = $aqConfig->getLightOn();
        $lightOff = $aqConfig->getLightOff();
        $filterOn = $aqConfig->getFilterOn();
        $filterOff = $aqConfig->getFilterOff();
        $airOn = $aqConfig->getAirOn();
        $airOff = $aqConfig->getAirOff();
        $waterLvlAlert = $aqConfig->getWaterLvlAlert();
        $prefLight = $aqConfig->getPrefLight();
        $feedingTime = $aqConfig->getFeedingTime();
        $foodPortions = $aqConfig->getFoodPortions();
        $filterClean = $aqConfig->getFilterClean();
        $waterChange = $aqConfig->getWaterChange();
        $samplePeriod = $aqConfig->getSamplePeriod();
        $lastModifiedDate = $aqConfig->getLastModifiedDate()->format('Y-m-d H:i:s');
        $id = $aqConfig->getAquariumId();
        $stm->bind_param("iissiiiiiiiiiiiiisi", $minTemp, $maxTemp, $minPh, $maxPh, $lightOn, $lightOff, $filterOn, $filterOff, $airOn, $airOff, $waterLvlAlert, $prefLight, $feedingTime, $foodPortions, $filterClean, $waterChange, $samplePeriod, $lastModifiedDate, $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function selectSensorSamplesForAquarium(int $id): array
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_SENSOR_SAMPLES_FOR_AQUARIUM);
        $stm->bind_param("i", $id);
        $stm->execute();
        $res = $stm->get_result();
        $stm->close();
        $samples = [];
        if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) {
                $samples[] = new SensorSample($row["id"], new DateTime("@" . $row["sampleTime"]), $row["temp"], $row["ph"], $row["waterLvl"], $row["lightAmount"]);
            }
        }
        return $samples;
    }

    function selectSensorSamplesInDateRange(int $id, DateTime $d1, DateTime $d2): array
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_SENSOR_SAMPLES_FOR_AQUARIUM_IN_RANGE);
        $d1 = $d1->format("Y-m-d H:i:s");
        $d2 = $d2->format("Y-m-d H:i:s");
        $stm->bind_param("iss", $id, $d1, $d2);
        $stm->execute();
        $res = $stm->get_result();
        $stm->close();
        $samples = [];
        if ($res->num_rows > 0) {
            while ($row = $res->fetch_assoc()) {
                $samples[] = new SensorSample($row["id"], new DateTime("@" . $row["sampleTime"]), $row["temp"], $row["ph"], $row["waterLvl"], $row["lightAmount"]);
            }
        }
        return $samples;
    }

    function createSensorSample(SensorSample $sample): bool
    {
        $stm = $this->connection->prepare(AQDAO::CREATE_SENSOR_SAMPLE);
        $aquariumId = $sample->getId();
        $sampleTime = $sample->getSampleTime()->format('Y-m-d H:i:s');
        $temp = $sample->getTemp();
        $ph = $sample->getPh();
        $waterLvl = $sample->getWaterLvl();
        $lightAmount = $sample->getLightAmount();

        $stm->bind_param("isisii", $aquariumId, $sampleTime, $temp, $ph, $waterLvl, $lightAmount);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function deleteSensorSample(SensorSample $sample): bool
    {
        $stm = $this->connection->prepare(AQDAO::DELETE_SENSOR_SAMPLE);
        $id = $sample->getId();
        $stm->bind_param("i", $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function updateSensorSample(SensorSample $sample): bool
    {
        $stm = $this->connection->prepare(AQDAO::UPDATE_SENSOR_SAMPLE);
        $sampleTime = $sample->getSampleTime()->format('Y-m-d H:i:s');
        $temp = $sample->getTemp();
        $ph = $sample->getPh();
        $waterLvl = $sample->getWaterLvl();
        $lightAmount = $sample->getLightAmount();
        $id = $sample->getId();

        $stm->bind_param("sisiii", $sampleTime, $temp, $ph, $waterLvl, $lightAmount, $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }
}