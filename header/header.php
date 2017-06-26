<ul id="navbar">
    <li><a href="#montage">Camagru</a></li>
    <?php
        if (isset($_SESSION[logged_on_user]) && $_SESSION[logged_on_user] == "yes") {
    ?>
    <li><a id="logout-button" href="#">Log out<a/></li>
    <?php
        } else {
    ?>
    <li><a id="login-button" href="#">Login</a></li>
    <?php }; ?>
    <li><a id="signup-button" href="#">Sign up</a></li>
    <li><a href="#gallery">Gallery</a></li>
</ul>
