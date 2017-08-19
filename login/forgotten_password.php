<?php

include '../lib/functions.php';

if (!isset($_POST['login']) || (!login_exists($_POST['login']) && !email_exists($_POST['login']))) {
  echo "<p class='error_msg'>We can't find your account.</p>";
  die;
}
else {
  print(send_new_password_mail($_POST['login']));
}

function send_new_password_mail($login) {
  include '../config/database.php';

  $reset_id = bin2hex(openssl_random_pseudo_bytes(32));
  try {
      $db = new pdo($DB_DSN, $DB_USER, $DB_PASSWORD, array(
          PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      ));

      $sql = "UPDATE `camagru`.`users`
              SET `reset_id` = :reset_id
              WHERE `login` = :login
              OR `email` = :email;";

      $query = $db->prepare($sql);
      $query->bindParam(':reset_id', $reset_id, PDO::PARAM_STR);
      $query->bindParam(':login', $_POST['login'], PDO::PARAM_STR);
      $query->bindParam(':email', $_POST['login'], PDO::PARAM_STR);
      $query->execute();

      $sql = "SELECT `email`
              FROM `camagru`.`users`
              WHERE `login` = :login
              OR `email` = :email;";

      $query = $db->prepare($sql);
      $query->bindParam(':login', $_POST['login'], PDO::PARAM_STR);
      $query->bindParam(':email', $_POST['login'], PDO::PARAM_STR);
      $query->execute();
      $result = $query->fetchAll(PDO::FETCH_COLUMN);
      $email = $result[0];

      $message = "You asked for a password reinitialisation.\r\n\r\n";
      $message .= "In order to change your password, please click on the link below :\r\n";
      $message .= "http://" . $_SERVER['HTTP_HOST'] . "?reset_id=$reset_id";

      mail($email, "Camagru reset password", $message);
      return "<p class='success_msg'>An email has been sent to you to reset your password.</p>";
    }catch(PDOException $e){
      echo 'ERROR PDO :' . $e->getMessage();
    }
}
