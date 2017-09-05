window.addEventListener("load", function(){
  if (document.getElementById("forgotten-password-validation") != null) {
    document.getElementById("forgotten-password-validation").addEventListener("click", send_new_password_mail);
  }

  if (document.getElementById("new-password-validation") != null) {
    document.getElementById("new-password-validation").addEventListener("click", change_password);
    document.getElementById("new-password").addEventListener("keyup", check_new_password);
  }
  function send_new_password_mail() {
    delete_temporary_messages();
    document.getElementById("forgotten-password-validation").setAttribute('disabled', 'disabled');
    document.getElementById('loading-gif3').style.display = 'inline-block';
    var login = document.getElementById("login3").value;
    var post_data = "login=" + login;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        forgotten_password_callback(this);
      }
    };
    xhttp.open("POST", "login/forgotten_password.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(post_data);
  }

  function forgotten_password_callback(response) {
    document.getElementById('loading-gif3').style.display = 'none';
    var div = document.getElementById("loading-gif3");
    div.insertAdjacentHTML('beforebegin', response.response);
    document.getElementById("forgotten-password-validation").removeAttribute('disabled');
  }

  function check_new_password() {
    var reg = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    var password = document.getElementById("new-password");

    if (reg.test(password.value)) {
      password.className = "valid";
    }
    else {
      password.className = "error";
    }
  }

  function change_password() {
    delete_temporary_messages();
    document.getElementById("new-password-validation").setAttribute('disabled', 'disabled');
    document.getElementById('loading-gif4').style.display = 'inline-block';
    var new_password = document.getElementById("new-password").value;
    var reset_id = $_GET('reset_id');
    var post_data = "new_password=" + new_password + "&reset_id=" + reset_id;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        new_password_callback(this);
      }
    };
    xhttp.open("POST", "login/new_password.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(post_data);
  }

  function new_password_callback(response) {
    if (response.response) {
      document.getElementById('loading-gif4').style.display = 'none';
      var div = document.getElementById("loading-gif4");
      div.insertAdjacentHTML('beforebegin', response.response);
      document.getElementById("new-password-validation").removeAttribute('disabled');
    }
    else {
      location.replace("http://" + window.location.host);
    }
  }
});

function reset_password() {
  if (document.getElementById("new-password-window") != null) {
    document.getElementById("new-password-window").style.display = 'flex';
  }
}

function $_GET(param) {
	var vars = {};
	window.location.href.replace( location.hash, '' ).replace(
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;
	}
	return vars;
}
