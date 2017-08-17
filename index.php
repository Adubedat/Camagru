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
      include('login/login.php');

    ?>
  </body>
</html>
