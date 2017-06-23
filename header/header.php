<?php
    session_start();
?>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="header/header.css">
    <link href="https://fonts.googleapis.com/css?family=Arizonia" rel="stylesheet">
  </head>
  <body>
    <div id="header-container">
        <div class="header-div" id="accueil">Camagru</div>
        <div id="left-bloc">
          <div class="header-div" id="Gallery"><p>Gallery</p></div>

          <div class="header-div" id="signup"><p>Sign up</p></div>
          <?php
            if (isset($_SESSION[logged_on_user]) && $_SESSION[logged_on_user] == "yes") {
          ?>
          <div class="header-div" id="logout"><p>Log out</p></div>
          <?php
            } else {
          ?>
          <div class="header-div" id="signin"><p>Login</p></div>
          <?php }; ?>
        </div>
    </div>
  </body>
</html>
