<?php

require_once '../db_connect.php';

// connecting to db
$db = new DB_CONNECT();

try{
   $sql = "CREATE TABLE route(
      route_id INT NOT NULL AUTO_INCREMENT,
      title VARCHAR(255),
      description VARCHAR(255),
      routeCoordinates TEXT,
      username VARCHAR(30),
      PRIMARY KEY (route_id)
   )";
   mysql_query($sql);
}
catch(Exception $e){
    die(print_r($e));
}
echo "<h3>Route table created.</h3>";

?>
