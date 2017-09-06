<?php

  include '../lib/functions.php';

  if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    echo "<p class='error_msg'>Your email is not valid. (me@exemple.com expected)</p>";
    die;
  }
  else if (!preg_match("/^([a-zA-Z0-9 _-]+)$/", $_POST['login']) || strlen($_POST['login']) > 16) {
    echo "<p class='error_msg'>Your login is not valid. (16 characters max. Only lowercase, uppercase, digits, spaces and -_)</p>";
    die;
  }
  else if (!preg_match("/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/", $_POST['password'])) {
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
  else {
    print(create_user($_POST['email'], $_POST['login'], $_POST['password']));
  }

  function create_user($email, $login, $password) {

    include '../config/database.php';
    $activation_id = bin2hex(openssl_random_pseudo_bytes(32));
    $password = hash('whirlpool', $password);
    try {
        $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        ));

        $sql = "INSERT INTO `camagru`.`users` (`login`, `password`, `email`, `activation_id`)
                VALUES (:login, :password, :email, :activation_id);";
        $query = $db->prepare($sql);
        $query->bindParam(':login', $login, PDO::PARAM_STR);
        $query->bindParam(':email', $email, PDO::PARAM_STR);
        $query->bindParam(':password', $password, PDO::PARAM_STR);
        $query->bindParam(':activation_id', $activation_id, PDO::PARAM_STR);
        $query->execute();
      }catch(PDOException $e){
        echo 'ERROR PDO :' . $e->getMessage();
      }
      return (send_email_confirmation($email, $login, $activation_id));
  }

  function send_email_confirmation($email, $login, $activation_id) {
    $message = "Welcome to Camagru $login.\r\n\r\n";
    $message .= "In order to activate your account, please click on the link below :\r\n";
    $message .= "http://" . $_SERVER['HTTP_HOST'] . "/signup/activation.php?id=$activation_id";

    mail($email, "Camagru account activation", $message);
    return "<p class='success_msg'>An activation email has been sent to your email address.</p>";
  }
