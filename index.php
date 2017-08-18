<?php

session_start();
include('config/setup.php');

?>

<html>
  <head>
    <link rel="stylesheet" type="text/css" href="header/header.css">
    <link rel="stylesheet" type="text/css" href="signup/signup.css">
    <link rel="stylesheet" type="text/css" href="login/login.css">
    <link href="https://fonts.googleapis.com/css?family=Arizonia" rel="stylesheet">
    <script type="text/javascript" src="signup/signup.js" ></script>
    <script type="text/javascript" src="login/login.js" ></script>
  </head>
  <body>
    <?php

      include('header/header.php');
      include('signup/signup.php');
      if (!isset($_SESSION['logged_on_user']) || $_SESSION['logged_on_user'] != "yes") {
        include('login/login.php');
        include('login/forgotten-password.html');
        if (isset($_SESSION['activation']) && $_SESSION['activation'] == "yes") {
          unset($_SESSION['activation']);
          ?>
            <script type="text/javascript">
              account_activated();
            </script>
          <?php
        }
      }
    ?>
  </body>
</html>
