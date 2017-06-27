<?php

  include '../config/database.php';

  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo "<p class='error_msg'>Your email is not valid. (me@exemple.com expected)</p>";
    die;
  }
  else if (!preg_match("/^([a-zA-Z0-9 _-]+)$/", $_POST['login'])) {
    echo "<p class='error_msg'>Your login is not valid. (Only lowercase, uppercase, digits, spaces and -_)</p>";
    die;
  }
  else if (!preg_match("/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/", $_POST['password'])) {
    echo "<p class='error_msg'>Your password is not valid. (You need at least 8 characters with one lowercase and one digit)</p>";
    die;
  }
  else if ($_POST['password'] != $_POST['password_confirmation']) {
    echo " <p class='error_msg'>Your passwords are different.</p>";
    die;
  }
  else if (email_exists($_POST['email'])) {
    echo "<p class='error_msg'>Your email address is already used.</p>";
    die;
  }
  else if (login_exists($_POST['login'])) {
    echo "<p class='error_msg'>Your login already exists.</p>";
    die;
  }

  function email_exists($email) {
    try {
        $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ));

        $sql = "SELECT COUNT(*)
                FROM 'camagru'.'users'
                WHERE 'email' = :email";
        $query = $db->prepare($sql);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->execute();
        $result = $query->fetchAll();
        if ($result[0] > 0) {
          echo "<p class='error_msg'>Your email address is already used.</p>";
          die;
        }
      }catch(PDOException $e){
        echo $e->getMessage();
      }
  }

  function login_exists($login) {
    try {
        $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ));

        $sql = "SELECT COUNT(*)
                FROM 'camagru'.'users'
                WHERE 'login' = :login";
        $query = $db->prepare($sql);
        $query->bindParam(':login', $login, PDO::PARAM_STR);
        $query->execute();
        $result = $query->fetchAll();
        if ($result[0] > 0) {
          echo "<p class='error_msg'>Your login is already used.</p>";
          die;
        }
      }catch(PDOException $e){
        echo $e->getMessage();
      }
  }
  print_r($_POST, true);