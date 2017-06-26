<?php

session_start();
include('config/setup.php');

?>

<html>
  <head>
    <link rel="stylesheet" type="text/css" href="header/header.css">
    <link rel="stylesheet" type="text/css" href="signup/signup.css">
    <link href="https://fonts.googleapis.com/css?family=Arizonia" rel="stylesheet">
    <script type="text/javascript" src="signup/signup.js" ></script>
  </head>
  <body>
    <?php

      include('header/header.php');
      include('signup/signup.php');

    ?>
  </body>
</html>
