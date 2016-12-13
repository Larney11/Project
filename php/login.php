<?php

$response = array();

require_once __DIR__ . '/db_connect.php';

// connecting to db
$db = new DB_CONNECT();

if(isset($_POST['username']))
{
  $username = $_POST['username'];
  $password = $_POST['password'];

  $result = mysql_query("SELECT * FROM user WHERE username = '$username' AND password = $password");

  if (!empty($result)) {

      if (mysql_num_rows($result) > 0) {

          $result = mysql_fetch_array($result);

          $user = array();
          $user["username"] = $result["username"];
          $user["password"] = $result["password"];

          $response["success"] = 1;
          $response["status"] = 200;
          $response["message"] = "User found";

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
