<?php
    session_start();
?>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="header/header.css">
    <link href="https://fonts.googleapis.com/css?family=Arizonia" rel="stylesheet">
  </head>
  <body>
    <ul id="navbar">
        <li><a href="#montage">Camagru</a></li>
        <li><a href="#gallery">Gallery</a></li>

        <li><a href="#">Sign up</a></li>
        <?php
            if (isset($_SESSION[logged_on_user]) && $_SESSION[logged_on_user] == "yes") {
        ?>
        <li><a href="#">Log out<a/></li>
        <?php
            } else {
        ?>
        <li><a href="#">Login</a></li>
        <?php }; ?>
    </ul>
  </body>
</html>
