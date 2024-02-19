<?php
/**
 * A context so the DAO will be able to execute queries and avoid too many connections
 */

class DataContext
{
    private $users;
    private $aquariums;
    private $configs;
    private $samples;
}