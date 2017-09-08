<?php
session_start();

if (isset($_POST['gallery']) && $_POST['gallery'] == "yes") {
  echo json_encode(load_gallery());
}

if (isset($_POST['likes']) && isset($_POST['picture_name']) && $_POST['likes'] == "yes") {
  echo json_encode(load_likes($_POST['picture_name']));
}

if (isset($_POST['like_event']) && isset($_POST['picture_name']) && $_POST['like_event'] == "yes") {
  echo like_event($_POST['picture_name']);
}

if (isset($_POST['comment_event']) && isset($_POST['picture_name']) && isset($_POST['comment']) && $_POST['comment_event'] == "yes") {
  echo comment_event($_POST['picture_name'], $_POST['comment']);
}

if (isset($_POST['comments']) && isset($_POST['picture_name']) && $_POST['comments'] == "yes") {
  echo json_encode(load_comments($_POST['picture_name']));
}

if (isset($_POST['user']) && $_POST['user'] == "yes") {
  echo $_SESSION['logged_on_user'];
}

function like_event($picture_name) {
  if (!$_SESSION['logged_on_user'] ||  $_SESSION['logged_on_user'] == "") {
    die;
  }
  $likes = load_likes($picture_name);
  foreach ($likes as $elem) {
    if (in_array($_SESSION['logged_on_user'], $elem)) {
      return (remove_like($_SESSION['logged_on_user'], $picture_name));
    }
  }
  return (add_like($_SESSION['logged_on_user'], $picture_name));
}

function comment_event($picture_name, $comment) {
  if (!$_SESSION['logged_on_user'] ||  $_SESSION['logged_on_user'] == "" || strlen($comment > 1024) || strlen($comment) <= 0) {
    die;
  }
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "INSERT INTO `camagru`.`comments` (`author_login`, `picture_name`, `comment`)
              VALUES (:author, :picture_name, :comment);";
      $query = $db->prepare($sql);
      $query->bindParam(':author', $_SESSION['logged_on_user'], PDO::PARAM_STR);
      $query->bindParam(':picture_name', $picture_name, PDO::PARAM_STR);
      $query->bindParam(':comment', $comment, PDO::PARAM_STR);
      $query->execute();
      return ($comment);
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
}

function remove_like($author, $picture_name) {
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "DELETE FROM `camagru`.`likes`
              WHERE `author_login` = :author
              AND `picture_name` = :picture_name;";
      $query = $db->prepare($sql);
      $query->bindParam(':author', $author, PDO::PARAM_STR);
      $query->bindParam(':picture_name', $picture_name, PDO::PARAM_STR);
      $query->execute();
      return ('like removed');
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
}

function add_like($author, $picture_name) {
  include ('../config/database.php');

  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "INSERT INTO `camagru`.`likes` (`author_login`, `picture_name`)
              VALUES (:author, :picture_name);";
      $query = $db->prepare($sql);
      $query->bindParam(':author', $author, PDO::PARAM_STR);
      $query->bindParam(':picture_name', $picture_name, PDO::PARAM_STR);
      $query->execute();
      return ('like added');
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
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
