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
    }
  }

  document.getElementById("email").addEventListener("keypress", check_mail);
  document.getElementById("login").addEventListener("keypress", check_login);
  document.getElementById("password").addEventListener("keypress", check_password);
  document.getElementById("password-confirmation").addEventListener("keypress", check_password);
};

function addEventListenerList(list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}

function close_form() {
  document.getElementById("signup").style.display = "none";
}

function check_mail() {
  /\S+@\S+\.\S+/
}
