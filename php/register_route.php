<?php

   $response = array();

   require_once __DIR__ . '/db_connect.php';

   // connecting to db
   //$db = new DB_CONNECT();

   // Checks for required field
   if(isset($_POST['title']) && isset($_POST['description']) && isset($_POST['routeCoordinates']))
   {
      $title = $_POST['title'];
      $description = $_POST['description'];
      $username = $_POST['username'];
      //$route_array = $_POST['routeCoordinates'];
      //$route_string = mysql_real_escape_string(serialize($route_array));
      //-----> Look into -----> $db->escape_string('This is an unescape "string"');

      $statement = $pdo->prepare("INSERT INTO route (title, description, routeCoordinates, username) VALUES(?, ?, ?, ?)");
      $statement->execute([$title, $description, "", $username]);

      $response["success"] = 1;
      $response["status"] = 200;
      $response["message"] = "Route uploaded";

      echo json_encode($response);
   }
   else if(isset($_GET['route_id'])) {

      $statement = $pdo->prepare("SELECT * FROM route");
      $statement->execute();
      $results = $statement->fetchAll(PDO::FETCH_ASSOC);

      //$response["success"] = 1;
      ///$response["status"] = 200;
      //$response["routes"] = json_encode($response);
      //echo $response;

      echo json_encode($results);
}
?>
