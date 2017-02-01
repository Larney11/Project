<?php

   $response = array();

   require_once __DIR__ . '/db_connect.php';

   if(isset($_POST['username']) && isset($_POST['password']))
   {
      $username = $_POST['username'];
      $password = $_POST['password'];

      $stmt = $pdo->prepare('SELECT * FROM user WHERE username = ? AND password = ?');
      $stmt->execute([$username, $password]);
      $result = $stmt->fetch();

      if (!empty($result)) {
         $response["success"] = 1;
         $response["status"] = 200;
         $response["message"] = "User found";

         // returns response in JSON format
         echo json_encode($response);

      }
      else {
         $response["success"] = 1;
         $response["status"] = 404;
         $response["message"] = "User not found";

         // returns response in JSON format
         echo json_encode($response);
      }
   }
?>
