<?php

function email_exists($email) {

  include '../config/database.php';

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));
      $sql = 'SELECT COUNT(*)
              FROM `camagru`.`users`
              WHERE `email` = :email;';
      $query = $db->prepare($sql);
      $query->bindParam(':email', $email, PDO::PARAM_STR);
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

function login_exists($login) {

  include '../config/database.php';

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "SELECT COUNT(*)
              FROM `camagru`.`users`
              WHERE `login` = :login;";
      $query = $db->prepare($sql);
      $query->bindParam(':login', $login, PDO::PARAM_STR);
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
