<?php
session_start();

include_once('../lib/functions.php');

if (!login_exists($_POST['login'])) {
  echo "<p class='error_msg'>Wrong login.</p>";
  die;
}

else if (!good_password($_POST['login'], $_POST['password'])) {
  echo "<p class='error_msg'>Wrong password.</p>";
  die;
}

else if (!is_account_activated($_POST['login'], $_POST['password'])) {
  echo "<p class='error_msg'>Your account is not activated.</p>";
  die;
}
else {
  $_SESSION['logged_on_user'] = $_POST['login'];
}

function good_password($login, $password) {

  $password = hash('whirlpool', $password);
  include '../config/database.php';

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "SELECT COUNT(*)
              FROM `camagru`.`users`
              WHERE `login` = :login
              AND `password` = :password;";
      $query = $db->prepare($sql);
      $query->bindParam(':login', $login, PDO::PARAM_STR);
      $query->bindParam(':password', $password, PDO::PARAM_STR);
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

function is_account_activated($login, $password) {

  $password = hash('whirlpool', $password);
  include '../config/database.php';

  try {
    $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ));

    $sql = "SELECT COUNT(*)
            FROM `camagru`.`users`
            WHERE `login` = :login
            AND `password` = :password
            AND `is_activated` = 1;";
    $query = $db->prepare($sql);
    $query->bindParam(':login', $login, PDO::PARAM_STR);
    $query->bindParam(':password', $password, PDO::PARAM_STR);
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
