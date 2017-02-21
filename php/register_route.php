<?php

   $response = array();

   require_once __DIR__ . '/db_connect.php';

   // Checks for required field
   if(isset($_POST['username']) && isset($_POST['title']) && isset($_POST['description']) && isset($_POST['routeCoordinates']))
   {
      $title = $_POST['title'];
      $description = $_POST['description'];
      $username = $_POST['username'];
      $routeCoordinates = $_POST['routeCoordinates'];

      $stmt = $pdo->prepare("INSERT INTO route (username, title, description, time, distance, activity, accessibility, visibility, difficulty) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)");
      $stmt->execute([$username, $title, $description, "", "", "", "", "", ""]);
      $last_id = $pdo->lastInsertId();

      $index = 0;

      $routeCoordinatesArray = json_decode($routeCoordinates, true);
      //echo $routeCoordinatesArray;

      try {

        foreach($routeCoordinatesArray as $item) { //foreach element in $arr

          $longitude = $item["longitude"];
          $latitude = $item["latitude"];
          $longitudeDelta = $item["longitudeDelta"];
          $latitudeDelta = $item["latitudeDelta"];

          if($index == 0) {

            // Insert marker coordinate (This is the the first coordinate of the route coordinates)
            $stmt = $pdo->prepare("INSERT INTO route_marker (route_id, longitude, latitude, longitudeDelta, latitudeDelta) VALUES(?, ?, ?, ?, ?)");
            $stmt->execute([$last_id, $longitude, $latitude, $longitudeDelta, $latitudeDelta]);

            // Insert route coordinates
            $stmt = $pdo->prepare("INSERT INTO route_coord (route_id, longitude, latitude, longitudeDelta, latitudeDelta) VALUES(?, ?, ?, ?, ?)");
            $stmt->execute([$last_id, $longitude, $latitude, $longitudeDelta, $latitudeDelta]);

            $index = $index + 1;
          }
          else {

            // Insert route coordinates
            $stmt = $pdo->prepare("INSERT INTO route_coord (route_id, longitude, latitude, longitudeDelta, latitudeDelta) VALUES(?, ?, ?, ?, ?)");
            //$stmt->execute([$last_id, $item['longitude'], $item['latitude'], $item['longitudeDelta'], $item['latitudeDelta']]);
            $stmt->execute([$last_id, $longitude, $latitude, $longitudeDelta, $latitudeDelta]);
          }
        }
      } catch(PDOException $e) {

        echo $e->getMessage();
      }

      $response["success"] = 1;
      $response["status"] = 200;
      $response["message"] = "Route uploaded";

      echo json_encode($response);
   }
   else if(isset($_GET['route_id'])) {


     $route_id = $_GET['route_id'];
/*
     $stmt = $pdo->prepare("SELECT longitude, latitude, longitudeDelta, latitudeDelta FROM route_coord WHERE route_id = ?");
     $stmt->execute([$route_id]);
     $resultsCoord = $stmt->fetchAll(PDO::FETCH_ASSOC);
*/
     $stmt = $pdo->prepare("SELECT * FROM route r, route_marker rm WHERE r.route_id = ? AND r.route_id = rm.route_id");
      //$stmt = $pdo->prepare("SELECT * FROM route r, route_marker rm WHERE r.route_id = ? AND r.route_id = rm.route_id");
      $stmt->execute([$route_id]);
      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
      //$results['route_coordinates'] = $resultsCoord;

      echo json_encode($results);
    }
?>
