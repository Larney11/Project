<?php

require_once '../db_connect.php';

// connecting to db
$db = new DB_CONNECT();

try{
   $sql = "CREATE TABLE route(
      route_id INT NOT NULL AUTO_INCREMENT,
      username VARCHAR(30),
      title VARCHAR(255),
      description VARCHAR(255),
      time VARCHAR(20),
      distance VARCHAR(30),
      activity VARCHAR(30),
      accessibility VARCHAR(20),
      visibility VARCHAR(20),
      difficulty VARCHAR(30),
      PRIMARY KEY (route_id),
      FOREIGN KEY(username)
        references user (username)
   )";
/*
   CREATE TABLE route_coord(
      route_id INT,
      longitude DECIMAL(30,25),
      latitude DECIMAL(30,25),
      longitudeDelta DECIMAL(30,25),
      latitudeDelta DECIMAL(30,25),
      FOREIGN KEY(route_id)
        references route (route_id)
   );

   CREATE TABLE route_marker(
      route_id INT,
      longitude DOUBLE(30,25),
      latitude DOUBLE(30,25),
      longitudeDelta DOUBLE(30,25),
      latitudeDelta DOUBLE(30,25),
      FOREIGN KEY(route_id)
        references route (route_id)
   );
   */


   mysql_query($sql);
}
catch(Exception $e){
    die(print_r($e));
}
echo "<h3>Route table created.</h3>";

?>