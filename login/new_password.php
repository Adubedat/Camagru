<?php

session_start();
if (!isset($_POST['reset_id']) || !reset_id_exists($_POST['reset_id'])) {
  echo "<p class='error_msg'>Can not find your account, restart the complete process.</p>";
  die;
}
else if (!preg_match("/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/", $_POST['new_password'])) {
  echo "<p class='error_msg'>Your password is not valid. (You need at least 8 characters with one lowercase and one digit)</p>";
  die;
}
else {
  change_password($_POST['new_password'], $_POST['reset_id']);
}

function change_password($new_password, $reset_id) {
  include '../config/database.php';

  $new_password = hash('whirlpool', $new_password);
  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));
      $sql = "UPDATE `camagru`.`users`
              SET `password` = :new_password,
              `reset_id` = ''
              WHERE `reset_id` = :reset_id;";

      $query = $db->prepare($sql);
      $query->bindParam(':new_password', $new_password, PDO::PARAM_STR);
      $query->bindParam(':reset_id', $reset_id, PDO::PARAM_STR);
      $query->execute();

    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
    $_SESSION['password_changed'] = "yes";
}

function reset_id_exists($reset_id) {

  include '../config/database.php';

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));
      $sql = 'SELECT COUNT(*)
              FROM `camagru`.`users`
              WHERE `reset_id` = :reset_id';
      $query = $db->prepare($sql);
      $query->bindParam(':reset_id', $reset_id, PDO::PARAM_STR);
      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_COLUMN);
      if ($result[0] > 0) {
        return true;
      }
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
    return false;
}
