<?php

session_start();

if (isset($_POST['author']) && $_POST['author'] == "yes") {
  echo json_encode(load_author_pictures());
}

if (isset($_POST['delete_image']) && $_POST['delete_image'] != null) {
  delete_picture($_POST['delete_image']);
}

function img_to_db($img, $today) {
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "INSERT INTO `camagru`.`pictures` (`picture_location`, `creation_date`, `author`)
              VALUES (:img, :today, :login);";
      $query = $db->prepare($sql);
      $query->bindParam(':img', $img, PDO::PARAM_STR);
      $query->bindParam(':today', $today, PDO::PARAM_STR);
      $query->bindParam(':login', $_SESSION['logged_on_user'], PDO::PARAM_STR);
      $query->execute();
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
}

function load_author_pictures() {
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "SELECT `picture_location`
              FROM `camagru`.`pictures`
              WHERE `author` = :login
              ORDER BY `creation_date` ASC;";
      $query = $db->prepare($sql);
      $query->bindParam(':login', $_SESSION['logged_on_user'], PDO::PARAM_STR);
      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_COLUMN);
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
    return ($result);
}

function delete_picture($img) {
  include ('../config/database.php');

  $array = split('/', $img);
  $src = end($array);
  echo $img;
  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "DELETE FROM `camagru`.`pictures`
              WHERE `picture_location` = :src;";

      $query = $db->prepare($sql);
      $query->bindParam(':src', $src, PDO::PARAM_STR);
      $query->execute();
      if (file_exists($img)) {
        unlink($img);
      }
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
}
