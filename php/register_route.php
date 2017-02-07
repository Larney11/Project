<?php

   $response = array();

   require_once __DIR__ . '/db_connect.php';

   // connecting to db
   //$db = new DB_CONNECT();

   // Checks for required field
   if(isset($_POST['username']) && isset($_POST['title']) && isset($_POST['description']) && isset($_POST['routeCoordinates'])

   )
   {
      $title = $_POST['title'];
      $description = $_POST['description'];
      $username = $_POST['username'];
      $routeCoordinates = $_POST['routeCoordinates'];
      $statement = $pdo->prepare("INSERT INTO route (username, title, description, time, distance, activity, accessibility, visibility, difficulty) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)");
      $statement->execute([$username, $title, $description, "", "", "", "", "", ""]);


      $response["success"] = 1;
      $response["status"] = 200;
      $response["message"] = "Route uploaded";

      echo json_encode($response);
   }
   else if(isset($_GET['route_id'])) {

      $statement = $pdo->prepare("SELECT * FROM route");
      $statement->execute();
      $results = $statement->fetchAll(PDO::FETCH_ASSOC);

      echo json_encode($results);
}
?>
