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
    <script type="text/javascript" src="login/forgotten_password.js" ></script>
  </head>
  <body>
    <?php

      include('header/header.php');
      if (!isset($_SESSION['logged_on_user']) || $_SESSION['logged_on_user'] == "") {
        include('signup/signup.php');
        include('login/login.php');
        include('login/forgotten-password.html');
        if (isset($_SESSION['password_changed']) && $_SESSION['password_changed'] != "") {
          unset($_SESSION['password_changed']);
          ?>
            <script type="text/javascript">
              password_changed();
            </script>
          <?php
        }
        if (isset($_SESSION['activation']) && $_SESSION['activation'] == "yes") {
          unset($_SESSION['activation']);
          ?>
            <script type="text/javascript">
              account_activated();
            </script>
          <?php
        }
        if (isset($_GET['reset_id']) && $_GET['reset_id'] != "") {
          include('login/new_password.html');
          ?>
            <script type="text/javascript">
              reset_password();
            </script>
          <?php
        }
      }
      if (isset($_SESSION['logged_on_user']) && $_SESSION['logged_on_user'] != "") {
        include('montage/montage.html');
      }
      else {
        echo '<p style="font-family:Arial;text-align:center;padding-top:150px;">You must be connected to see the montage section.</p>';
      }
      include ('gallery/gallery.html');
    ?>
  </body>
</html>
