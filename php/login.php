<?php

$response = array();

require_once __DIR__ . '/db_connect.php';

// connecting to db
$db = new DB_CONNECT();

// Checks for required field
if(isset($_POST['username']))
{
  $username = $_POST['username'];
  $password = $_POST['password'];

  $result = mysql_query("SELECT * FROM user WHERE username = '$username' AND password = $password");

  if (!empty($result)) {

      // If result has returned a row
      if (mysql_num_rows($result) > 0) {

          $response["success"] = 1;
          $response["status"] = 200;
          $response["message"] = "User found";

          // returns response in JSON format
          echo json_encode($response);
      } else {
          $response["success"] = 0;
          $response["status"] = 404;
          $response["message"] = "User not found";

          echo json_encode($response);
      }
    }
}
?>
