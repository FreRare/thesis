<?php
ini_set('memory_limit', '32M');

/**
 * Configuration class for database
 */
class DBConfig
{
    private $host = "localhost";
    private $user = "utazasco_abel";
    private $password = "Korm()s0127";
    private $database = "utazasco_remote_quarium";
    private $port = 3306;

    // DAO class reference so it's identifiable where the call came from
    private $daoClass;

    public function __construct()
    {
        $this->daoClass = "DAO";
    }

    /**
     * Returns the hostname if the caller class matches the requirements
     * @param string $callerClass 
     * @return (string | null) 
     */
    public function getHost(string $callerClass = null)
    {
        if ($callerClass !== $this->daoClass) {
            return null;
        } else {
            return $this->host;
        }
    }

    /**
     * Returns the user for database login if matches req.
     * @param string $callerClass
     * @return (string | null)
     */
    public function getUser(string $callerClass = null)
    {
        if ($callerClass === $this->daoClass) {
            return $this->user;
        } else {
            return null;
        }
    }

    /**
     * Returns the password for db login if matches the req.
     * @param string $callerClass
     * @return (string | null)
     */
    public function getPassword(string $callerClass = null)
    {
        if ($callerClass === $this->daoClass) {
            return $this->password;
        } else {
            return null;
        }
    }

    /**
     * Gets the name of the database to use if matches req.
     * @param string $callerClass
     * @return (string | null) 
     */
    public function getDatabase(string $callerClass = null)
    {
        if ($callerClass === $this->daoClass) {
            return $this->database;
        } else {
            return null;
        }
    }

    /**
     * Gets the port for the database to connect if matches req.
     * @param string $callerClass
     * @return (string | null) 
     */
    public function getPort(string $callerClass = null)
    {
        if ($callerClass === $this->daoClass) {
            return $this->port;
        } else {
            return null;
        }
    }

}
?>