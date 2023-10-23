<?php
    require_once($_SERVER["DOCUMENT_ROOT"] . '/DAO/DAO.php');

    $DAO = AQDAO::getInstance();
    $sql = file_get_contents($_SERVER["DOCUMENT_ROOT"] . '/DAO/Config/remoteQuarium.sql');
    $queries = explode(';', $sql);
    foreach($queries as $query){
            if($query == '') continue;
		    echo('Executing query: ' . $query);
		    echo('<br/>');
		    $res = $DAO->__query($query);
    		echo('<strong>Query result: ' . $res . '</strong>');
    		echo('<br/>');    	
    }
    echo('DB is ready!');

    //$DAO->__query($dbDelete);
    //$res = $DAO->__query($initDb);
    //echo(var_dump($res));
?>