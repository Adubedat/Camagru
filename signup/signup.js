window.onload = function(){
  document.getElementById("signup-button").onclick = function() {
    document.getElementById("signup").style.display = 'flex';
  };
  var close_list = document.getElementsByClassName("close");
  addEventListenerList(close_list, 'click', close_form);

  var modal = document.getElementById('signup');
  window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        delete_temporary_messages();
    }
  }

  document.getElementById("email").addEventListener("keyup", check_mail);
  document.getElementById("login").addEventListener("keyup", check_login);
  document.getElementById("password").addEventListener("keyup", check_password);
  document.getElementById("password-confirmation").addEventListener("keyup", check_password_confirmation);

  document.getElementById("signup-validation").addEventListener("click", registration);

  function registration() {
      delete_temporary_messages();
      document.getElementById("signup-validation").setAttribute('disabled', 'disabled');
      document.getElementById('loading-gif').style.display = 'inline-block';
      var email = document.getElementById("email").value;
      var login = document.getElementById("login").value;
      var password = document.getElementById("password").value;
      var password_confirmation = document.getElementById("password-confirmation").value;
      var post_data = "email=" + email + "&login=" + login + "&password=" + password + "&password_confirmation=" + password_confirmation;

      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          signup_callback(this);
        }
      };
      xhttp.open("POST", "signup/registration.php", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(post_data);
  }
  function signup_callback(response) {
    document.getElementById('loading-gif').style.display = 'none';
    var div = document.getElementById("loading-gif");
    div.insertAdjacentHTML('beforebegin', response.response);
    console.log(response);
  }

  function addEventListenerList(list, event, fn) {
      for (var i = 0, len = list.length; i < len; i++) {
          list[i].addEventListener(event, fn, false);
      }
  }

  function close_form() {
    document.getElementById("signup").style.display = "none";
    document.getElementById("signup-form").reset();
    var elements = document.querySelectorAll("form input");

    for (var i = 0; i < 4; i++) {
      elements[i].removeAttribute("class");
}
    delete_temporary_messages();
  }

  function check_mail() {
    var reg = /\S+@\S+\.\S+/;
    var email = document.getElementById("email");

    if (reg.test(email.value)) {
      email.className = "valid";
    }
    else {
      email.className = "error";
    }
    check_valid_form();
  }

  function check_login() {
    var reg = /^([a-zA-Z0-9 _-]+)$/;
    var login = document.getElementById("login");

    if (reg.test(login.value)) {
      login.className = "valid";
    }
    else {
      login.className = "error";
    }
    check_valid_form();
  }

  function check_password() {
    var reg = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    var password = document.getElementById("password");

    if (reg.test(password.value)) {
      password.className = "valid";
    }
    else {
      password.className = "error";
    }
    check_password_confirmation();
    check_valid_form();
  }

  function check_password_confirmation() {
    var password = document.getElementById("password");
    var password_confirmation = document.getElementById("password-confirmation");

    if (password.value == password_confirmation.value) {
      password_confirmation.className = "valid";
    }
    else {
      password_confirmation.className = "error";
    }
    check_valid_form();
  }

  function check_valid_form() {
    var email = document.getElementById("email").getAttribute("class");
    var login = document.getElementById("login").getAttribute("class");
    var password = document.getElementById("password").getAttribute("class");
    var password_confirmation = document.getElementById("password-confirmation").getAttribute("class");

    if (email == "valid" && login == "valid"
    && password == "valid" && password_confirmation == "valid") {
      document.getElementById("signup-validation").removeAttribute("disabled");
    }
    else {
      document.getElementById("signup-validation").setAttribute("disabled", "disabled");
    }
  }

  function delete_temporary_messages() {
    var elements = document.getElementsByClassName("error_msg");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    elements = document.getElementsByClassName("success_msg");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
  }
};
