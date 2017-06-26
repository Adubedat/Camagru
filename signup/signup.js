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
};

function addEventListenerList(list, event, fn) {
    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener(event, fn, false);
    }
}

function close_form() {
  document.getElementById("signup").style.display = "none";
}
