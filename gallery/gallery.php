<?php

if (isset($_POST['gallery']) && $_POST['gallery'] == "yes") {
  echo json_encode(load_gallery());
}

if (isset($_POST['likes']) && isset($_POST['picture_name']) && $_POST['likes'] == "yes") {
  echo json_encode(load_likes($_POST['picture_name']));
}

if (isset($_POST['comments']) && isset($_POST['picture_name']) && $_POST['comments'] == "yes") {
  echo json_encode(load_comments($_POST['picture_name']));
}

function load_gallery() {
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "SELECT *
              FROM `camagru`.`pictures`
              ORDER BY `creation_date` DESC
              LIMIT 5;";
      $query = $db->prepare($sql);
      $query->execute();
      $result = $query->fetchAll();
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
    return ($result);
}

function load_likes($picture_name) {
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "SELECT `author_login`
              FROM `camagru`.`likes`
              WHERE `picture_name` = :picture_name;";
      $query = $db->prepare($sql);
      $query->bindParam(':picture_name', $picture_name, PDO::PARAM_STR);
      $query->execute();
      $result = $query->fetchAll();
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
    return ($result);
}

function load_comments($picture_name) {
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "SELECT `author_login`, `comment`
              FROM `camagru`.`comments`
              WHERE `picture_name` = :picture_name;";
      $query = $db->prepare($sql);
      $query->bindParam(':picture_name', $picture_name, PDO::PARAM_STR);
      $query->execute();
      $result = $query->fetchAll();
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
    return ($result);
}
