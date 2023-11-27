<?php
require_once($_SERVER["DOCUMENT_ROOT"] . "/DAO/DAOI.php");
require_once($_SERVER["DOCUMENT_ROOT"] . '/DAO/Config/DBConfig.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/User.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/Aquarium.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/SensorSample.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/DAO/models/AquariumConfig.php');


/**
 * Data access object
 * Pefroms all queries and db interactions
 */
class AQDAO implements AQDAOI
{
    private static $instance = null;
    private $connection = null;
    private $config = null;
    private const CREATE_USER = "INSERT INTO users (email, firstName, lastName, password, deviceToken, authToken, inactive) VALUES (?, ?, ?, ?, ?, ?, false)";
    private const DELETE_USER = "UPDATE users SET inactive = true WHERE email = ?";
    private const SELECT_USER_BY_EMAIL = "SELECT * FROM users WHERE email = ? AND inactive IS NOT true";
    private const SELECT_USER_BY_TOKEN = "SELECT * FROM users WHERE authToken = ? AND inactive IS NOT true";
    private const UPDATE_USER = "UPDATE users SET email = ?, password = ?, firstName = ?, lastName = ?, deviceToken = ? WHERE email = ?";
    private const SELECT_AQUARIUM = "SELECT * FROM aquariums WHERE id = ? AND inactive IS NOT true";
    private const CREATE_AQUARIUM = "INSERT INTO aquariums (name, length, height, depth, fishCount, inactive) VALUES (?, ?, ?, ?, ?, false)";
    private const DELETE_AQUARIUM = "UPDATE aquariums SET inactive = true WHERE id = ?";
    private const UPDATE_AQUARIUM = "UPDATE aquariums SET name = ?, length = ?, height = ?, depth = ?, fishCount = ? WHERE id = ?";
    private const SELECT_CONFIG_FOR_AQUARIUM = "SELECT * FROM configs WHERE id = ?";
    private const CREATE_CONFIG = "INSERT INTO configs (id, minTemp, maxTemp, minPh, maxPh, OnOutlet1, OffOutlet1, OnOutlet2, OffOutlet2, OnOutlet3, OffOutlet3, waterLvlAlert, feedingTime, foodPortions, filterClean, waterChange, samplePeriod, lastModifiedDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private const DELETE_CONFIG = "DELETE FROM configs WHERE id = ?";
    private const UPDATE_CONFIG = "UPDATE configs SET minTemp = ?, maxTemp = ?, minPh = ?, maxPh = ?, OnOutlet1 = ?, OffOutlet1 = ?, OnOutlet2 = ?, OffOutlet2 = ?, OnOutlet3 = ?, OffOutlet3 = ?, waterLvlAlert = ?, feedingTime = ?, foodPortions = ?, filterClean = ?, waterChange = ?, samplePeriod = ?, lastModifiedDate = ? WHERE id = ?";
    private const SELECT_SENSOR_SAMPLES_FOR_AQUARIUM = "SELECT * FROM sensorSamples WHERE id = ?";
    private const SELECT_SENSOR_SAMPLES_FOR_AQUARIUM_IN_RANGE = "SELECT * FROM sensorSamples WHERE id = ? AND sampleTime >= ? AND sampleTime <= ?";
    private const CREATE_SENSOR_SAMPLE = "INSERT INTO sensorSamples (id, sampleTime, temp, ph, waterLvl, lightAmount) VALUES (?, ?, ?, ?, ?, ?)";
    private const DELETE_SENSOR_SAMPLE = "DELETE FROM sensorSamples WHERE id = ?";
    private const UPDATE_SENSOR_SAMPLE = "UPDATE sensorSamples SET sampleTime = ?, temp = ?, ph = ?, waterLvl = ?, lightAmount = ? WHERE id = ?";
    private const CREATE_HAVE_AQUARIUM = "INSERT INTO haveAquarium (email, id) VALUES (?, ?)";
    private const SELECT_USER_AQUARIUMS = "SELECT A.id, A.name, A.length, A.height, A.depth, A.fishCount, A.inactive FROM haveAquarium as HA INNER JOIN aquariums as A ON A.id = HA.id WHERE HA.email = ? AND A.inactive IS NOT true";
    private const SELECT_USER_BY_AQUARIUM_ID = "SELECT users.email, users.firstName, users.lastName, users.password, users.deviceToken, users.authToken FROM haveAquarium INNER JOIN users ON users.email = haveAquarium.email WHERE haveAquarium.id = ?  AND users.inactive IS NOT true";
    private const DELETE_HAVE_AQUARIUM_BY_ID = "DELETE FROM haveAquarium WHERE id = ?";
    private const DELETE_HAVE_AQUARIUM_BY_USER = "DELETE FROM haveAquarium WHERE email = ?";
    protected function __construct()
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
                    // echo ("Using DB " . $this->config->getDatabase("DAO"));
                }
            } catch (Error $e) {
                error_log("Error while connecting => " . $this->connection->error);
            }
        }
    }
    public static function getInstance(): AQDAO
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
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
        $stm->execute();
        $stm->bind_result($mail, $fname, $lname, $pass, $token, $authToken, $inactive);
        $stm->fetch();
        $stm->close();
        if (!isset($mail) || !isset($pass) || !isset($fname) || !isset($lname) || !isset($token) || !isset($authToken)) {
            error_log("Missing data after query!");
            return null;
        } else {
            return new User($mail, $pass, $fname, $lname, $token, $authToken, $inactive);
        }
    }

    function selectUserByToken(string $token)
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_USER_BY_TOKEN);
        $stm->bind_param("s", $token);
        $stm->execute();
        $stm->bind_result($user, $pass, $fname, $lname, $token, $authToken, $inactive);
        $stm->fetch();
        $stm->close();
        if (!isset($user) || !isset($pass) || !isset($fname) || !isset($lname) || !isset($token) || !isset($authToken) || !isset($inactive)) {
            return null;
        } else {
            return new User($user, $pass, $fname, $lname, $token, $authToken, $inactive);
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
        $token = $user->getDeviceToken();
        $authToken = $user->getAuthToken();
        $statement->bind_param("ssssss", $email, $fName, $lName, $pass, $token, $authToken);

        $success = $statement->execute();
        error_log($this->connection->error);
        $statement->close();
        return $success;
    }
    function deleteUser(string $email): bool
    {
        $stm = $this->connection->prepare(AQDAO::DELETE_USER);
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
        $newToken = $user->getDeviceToken();
        $stm->bind_param("ssssss", $newMail, $newPass, $newFname, $newLname, $newToken, $email);
        $success = $stm->execute();
        return $success;
    }
    function selectAquariumById(int $id)
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_AQUARIUM);
        $stm->bind_param("i", $id);
        $stm->execute();
        $stm->bind_result($id, $name, $length, $height, $width, $fishCount, $inactive);
        $stm->fetch();
        $stm->close();
        if (empty($id) || empty($name) || empty($length) || empty($height) || empty($width) || empty($fishCount)) {
            return null;
        } else {
            return new Aquarium($id, $name, $length, $height, $width, $fishCount);
        }
    }

    function createAquarium(Aquarium $aquarium)
    {
        $stm = $this->connection->prepare(AQDAO::CREATE_AQUARIUM);
        $name = $aquarium->getName();
        $length = $aquarium->getLength();
        $height = $aquarium->getHeight();
        $width = $aquarium->getWidth();
        $fishCount = $aquarium->getfishCount();
        $stm->bind_param("siiii", $name, $length, $height, $width, $fishCount);
        $success = $stm->execute();
        $newId = $stm->insert_id;
        $stm->close();
        if ($success) {
            return new Aquarium($newId, $name, $length, $height, $width, $fishCount);
        } else {
            return null;
        }
    }

    function deleteAquarium(int $id): bool
    {
        $stm = $this->connection->prepare(AQDAO::DELETE_AQUARIUM);
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
        $fishC = $aquarium->getfishCount();
        $stm->bind_param("siiiii", $name, $length, $height, $width, $fishC, $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }
    function selectAQConfigForAquarium(int $id)
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_CONFIG_FOR_AQUARIUM);
        $stm->bind_param("i", $id);
        $stm->execute();
        $stm->bind_result($id, $minT, $maxT, $minP, $maxP, $liOn, $liOff, $filOn, $filOff, $airOn, $airOff, $wAlert, $feedT, $foodPort, $filC, $waterC, $samplePeriod, $lModDate);
        $stm->fetch();
        $stm->close();
        $lModDateAsDateTime = new DateTime($lModDate);
        return new AquariumConfig($id, $minT, $maxT, $minP, $maxP, $liOn, $liOff, $filOn, $filOff, $airOn, $airOff, $wAlert, $feedT, $foodPort, $filC, $waterC, $samplePeriod, $lModDateAsDateTime);
    }

    function createAQConfig(AquariumConfig $aqConfig): bool
    {
        $stm = $this->connection->prepare(AQDAO::CREATE_CONFIG);
        $aquariumId = $aqConfig->getAquariumId();
        $minTemp = $aqConfig->getMinTemp();
        $maxTemp = $aqConfig->getMaxTemp();
        $minPh = $aqConfig->getMinPh();
        $maxPh = $aqConfig->getMaxPh();
        $lightOn = $aqConfig->getOnOutlet1();
        $lightOff = $aqConfig->getOffOutlet1();
        $filterOn = $aqConfig->getOnOutlet2();
        $filterOff = $aqConfig->getOffOutlet2();
        $airOn = $aqConfig->getOnOutlet3();
        $airOff = $aqConfig->getOffOutlet3();
        $waterLvlAlert = $aqConfig->getWaterLvlAlert();
        $feedingTime = $aqConfig->getFeedingTime();
        $foodPortions = $aqConfig->getFoodPortions();
        $filterClean = $aqConfig->getFilterClean();
        $waterChange = $aqConfig->getWaterChange();
        $samplePeriod = $aqConfig->getSamplePeriod();
        $lastModifiedDate = $aqConfig->getLastModifiedDate()->format('Y-m-d H:i:s');

        $stm->bind_param("issssiiiiiiiiiiiis", $aquariumId, $minTemp, $maxTemp, $minPh, $maxPh, $lightOn, $lightOff, $filterOn, $filterOff, $airOn, $airOff, $waterLvlAlert, $feedingTime, $foodPortions, $filterClean, $waterChange, $samplePeriod, $lastModifiedDate);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function deleteAQConfig(AquariumConfig $aqConfig): bool
    {
        $stm = $this->connection->prepare(AQDAO::DELETE_CONFIG);
        $id = $aqConfig->getAquariumId();
        $stm->bind_param("i", $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }

    function updateAQConfig(AquariumConfig $aqConfig): bool
    {
        $stm = $this->connection->prepare(AQDAO::UPDATE_CONFIG);
        $minTemp = $aqConfig->getMinTemp();
        $maxTemp = $aqConfig->getMaxTemp();
        $minPh = $aqConfig->getMinPh();
        $maxPh = $aqConfig->getMaxPh();
        $lightOn = $aqConfig->getOnOutlet1();
        $lightOff = $aqConfig->getOffOutlet1();
        $filterOn = $aqConfig->getOnOutlet2();
        $filterOff = $aqConfig->getOffOutlet2();
        $airOn = $aqConfig->getOnOutlet3();
        $airOff = $aqConfig->getOffOutlet3();
        $waterLvlAlert = $aqConfig->getWaterLvlAlert();
        $feedingTime = $aqConfig->getFeedingTime();
        $foodPortions = $aqConfig->getFoodPortions();
        $filterClean = $aqConfig->getFilterClean();
        $waterChange = $aqConfig->getWaterChange();
        $samplePeriod = $aqConfig->getSamplePeriod();
        $lastModifiedDate = $aqConfig->getLastModifiedDate()->format('Y-m-d H:i:s');
        $id = $aqConfig->getAquariumId();
        $stm->bind_param("ssssiiiiiiiiiiiisi", $minTemp, $maxTemp, $minPh, $maxPh, $lightOn, $lightOff, $filterOn, $filterOff, $airOn, $airOff, $waterLvlAlert, $feedingTime, $foodPortions, $filterClean, $waterChange, $samplePeriod, $lastModifiedDate, $id);
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

    function createAquariumConnection(User $user, Aquarium $aquarium): bool
    {
        if (!$user instanceof User || !$aquarium instanceof Aquarium) {
            return false;
        }

        $stm = $this->connection->prepare(AQDAO::CREATE_HAVE_AQUARIUM);
        $email = $user->getEmail();
        $id = $aquarium->getId();
        $stm->bind_param("ss", $email, $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }
    function selectUserAquariums(User $user): array
    {
        if (!$user instanceof User || !isset($user))
            return [];
        $stm = $this->connection->prepare(AQDAO::SELECT_USER_AQUARIUMS);
        $mail = $user->getEmail();
        $stm->bind_param("s", $mail);
        $stm->execute();
        $stm->bind_result($id, $name, $length, $height, $width, $fishCount, $inactive);

        $resultAquariums = [];
        while ($stm->fetch()) {
            $resultAquariums[] = new Aquarium($id, $name, $length, $height, $width, $fishCount);
        }
        $stm->close();
        return $resultAquariums;
    }
    function selectUserForAquarium(int $id)
    {
        $stm = $this->connection->prepare(AQDAO::SELECT_USER_BY_AQUARIUM_ID);
        error_log($this->connection->error);
        $stm->bind_param("i", $id);
        $stm->execute();
        $stm->bind_result($email, $firstName, $lastName, $password, $deviceToken, $authToken);
        error_log($email . $firstName . $lastName . $password . $deviceToken);
        $stm->fetch();
        $stm->close();
        if (empty($email) || empty($firstName) || empty($lastName) || empty($password) || empty($deviceToken) || empty($authToken) || empty($deviceToken) || empty($authToken)) {
            return null;
        }
        return new User($email, $password, $firstName, $lastName, $deviceToken, $authToken);
    }
    function deleteAquariumConnectionByAquarium(Aquarium $aquarium): bool
    {
        if (empty($id))
            return false;
        $stm = $this->connection->prepare(AQDAO::DELETE_HAVE_AQUARIUM_BY_ID);
        $id = $aquarium->getId();
        $stm->bind_param("i", $id);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }
    function deleteAquariumConnectionByUser(User $user): bool
    {
        if (empty($user) || !$user instanceof User)
            return false;
        $stm = $this->connection->prepare(AQDAO::DELETE_HAVE_AQUARIUM_BY_USER);
        $email = $user->getEmail();
        $stm->bind_param("s", $email);
        $success = $stm->execute();
        $stm->close();
        return $success;
    }
}