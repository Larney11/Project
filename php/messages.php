<?php

  $response = array();

  require_once __DIR__ . '/db_connect.php';

  // Checks for required field
  if(isset($_POST['route_id']) && isset($_POST['username']) && isset($_POST['messageBody']) && isset($_POST['datetime']))
  {
    $route_id = $_POST['route_id'];
    $username = $_POST['username'];
    $message_body = $_POST['messageBody'];
    $message_datetime = $_POST['datetime'];

    try
    {
      $stmt = $pdo->prepare("INSERT INTO route_message (route_id, username, message_body, message_datetime) VALUES(?, ?, ?, ?)");
      $stmt->execute([$route_id, $username, $message_body, $message_datetime]);
    } catch(PDOException $e)
    {
      echo $e->getMessage();
    }

    $response["success"] = 1;
    $response["status"] = 200;
    $response["message"] = "Message Uploaded";

    echo json_encode($response);
  }
  else if(isset($_GET['route_id']))
  {
    $route_id = $_GET['route_id'];
    try
    {
      $stmt = $pdo->prepare("SELECT * FROM route_message WHERE route_id = $route_id");
      $stmt->execute([]);
      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode($results, JSON_NUMERIC_CHECK);
    }catch(PDOException $e)
    {
      echo $e->getMessage();
    }
  }
?>
