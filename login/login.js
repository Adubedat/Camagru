window.addEventListener("load", function(){
  document.getElementById("login-button").onclick = function() {
    document.getElementById("login-window").style.display = 'flex';
  };

  document.getElementById("login-validation").addEventListener("click", login);

  function login() {
    delete_temporary_messages();
    document.getElementById("login-validation").setAttribute('disabled', 'disabled');
    document.getElementById('loading-gif2').style.display = 'inline-block';
    var login = document.getElementById("login2").value;
    var password = document.getElementById("password2").value;
    var post_data = "login=" + login + "&password=" + password;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        login_callback(this);
      }
    };
    xhttp.open("POST", "login/signin.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(post_data);
  }

  function login_callback(response) {
    if (response.response) {
      delete_temporary_messages();
      document.getElementById('loading-gif2').style.display = 'none';
      var div = document.getElementById("loading-gif2");
      div.insertAdjacentHTML('beforebegin', response.response);
      document.getElementById("login-validation").removeAttribute('disabled');
    }
    else {
      location.reload();
    }
  }
});
