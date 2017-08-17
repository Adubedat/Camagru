<?php

session_start();

if (isset($_GET['id'])) {
  include '../config/database.php';

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "UPDATE `camagru`.`users`
              SET `is_activated` = true
              WHERE `activation_id` = :id;";

      $query = $db->prepare($sql);
      $query->bindParam(':id', $_GET['id'], PDO::PARAM_STR);
      $query->execute();
      $_SESSION['activation'] = 'yes';
      header("Status: 301 Moved Permanently", false, 301);
      header("Location: http://". $_SERVER['HTTP_HOST']);
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
}
