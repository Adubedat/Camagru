load_gallery();

var user;
get_user();

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('load-more').addEventListener('click', load_more_gallery);
  document.getElementById('refresh-gallery').addEventListener('click', refresh_gallery);
});

function refresh_gallery() {
  while (document.getElementsByClassName('gallery-cell')[0] != null) {
    var grids = document.getElementsByClassName('gallery-cell');
    for (var i = 0; i < grids.length; i++) {
      grids[i].remove();
    }
  }
  load_gallery();
}

function load_more_gallery() {
  var elem = document.getElementsByClassName('like-button');
  var last_elem = elem[elem.length - 1];
  var picture_name = last_elem.value;
  load_more(picture_name);
}

function load_more(picture_name) {
  var post_data = "load_more=yes&picture_name=" + picture_name;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var pictures = JSON.parse(this.response);
        for (var i = 0; i < pictures.length; i++) {
          create_gallery_elem(pictures[i]);
        }
      }
    }
  };
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}

function load_gallery() {
  var post_data = "gallery=yes";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        var pictures_location = JSON.parse(this.response);
        for (var i = 0; i < pictures_location.length; i++) {
          create_gallery_elem(pictures_location[i]);
        }
      }
    }
  };
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}


function create_gallery_elem(picture) {
  var div = document.createElement('div');
  div.setAttribute('class', 'gallery-cell border-block');
  var author = document.createElement('p');
  author.setAttribute('class', 'left');
  author.appendChild(document.createTextNode(picture.author));
  div.appendChild(author);
  var creation_date = document.createElement('p');
  creation_date.setAttribute('class', 'right');
  creation_date.appendChild(document.createTextNode(picture.creation_date));
  div.appendChild(creation_date);
  var img = document.createElement('img');
  img.setAttribute('src', '../img/' + picture.picture_location);
  img.setAttribute('class', 'gallery-img');
  div.appendChild(img);
  var likes_div = document.createElement('div');
  likes_div.setAttribute('class', 'likes-div');
  div.appendChild(likes_div);
  var comments_div = document.createElement('div');
  comments_div.setAttribute('class', 'comments-div');
  div.appendChild(comments_div);
  load_likes(picture.picture_location, div);
  load_comments(picture.picture_location, div);
  document.getElementById('gallery-grid').appendChild(div);
}

function create_likes_elem(likes, div, picture_name) {
  var subdiv = div.getElementsByClassName('likes-div')[0];
  var likes_count = document.createElement('p');
  likes_count.setAttribute('class', 'left');
  likes_count.appendChild(document.createTextNode(likes.length + ' likes'));
  subdiv.appendChild(likes_count);
  if (user != null && user != '') {
    var likes_button = document.createElement('button');
    likes_button.appendChild(document.createTextNode('like'));
    likes_button.setAttribute('class', 'right like-button');
    likes_button.value = picture_name;
    likes_button.addEventListener('click', like_event);
    if (likes.length <= 0) {
      likes_button.style.backgroundColor = 'white';
    }
    likes.forEach(function(elem, i) {
      if (Object.values(elem).indexOf(user) > -1) {
        likes_button.style.backgroundColor = '#528ab9';
      }
      else {
        likes_button.style.backgroundColor = 'white';
      }
    });
    subdiv.appendChild(likes_button);
  }
}

function get_user() {
  var post_data = "user=yes";
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        user = this.response;
      }
    }
  };
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}

function like_event(e) {
  var picture_name = e.target.value;
  var post_data = "like_event=yes&picture_name=" + picture_name;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        if (this.response == 'like added') {
          e.target.style.backgroundColor = '#528ab9';
          var elem = e.target.previousSibling;
          var text = elem.innerHTML;
          var num = parseInt(text, 10);
          num += 1;
          elem.innerHTML = num + ' likes';
        }
        else if (this.response == 'like removed') {
          e.target.style.backgroundColor = 'white';
          var elem = e.target.previousSibling;
          var text = elem.innerHTML;
          var num = parseInt(text, 10);
          num -= 1;
          elem.innerHTML = num + ' likes';
        }
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}

function load_likes(picture_name, div) {
  var post_data = "likes=yes&picture_name=" + picture_name;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
          var likes = JSON.parse(this.response);
          create_likes_elem(likes, div, picture_name);
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}

function create_comments_elem(comments, div, picture_name) {
  var subdiv = div.getElementsByClassName('comments-div')[0];
  comments.forEach(function(comment) {
    var com = document.createElement('p');
    com.setAttribute('class', 'comment');
    com.style.backgroundColor = '#BED3E5';
    com.appendChild(document.createTextNode(comment.author_login + " : " + comment.comment));
    subdiv.insertBefore(com, subdiv.firstChild);
  })
  if (user != null && user != '') {
    var com_input = document.createElement('input');
    com_input.setAttribute('type', 'text');
    com_input.setAttribute('class', 'left comment-input');
    com_input.setAttribute('maxlength', '1024');
    com_input.setAttribute('placeholder', 'Write a comment ...');
    subdiv.appendChild(com_input);
    var com_button = document.createElement('button');
    com_button.setAttribute('class', 'right comment-button');
    com_button.value = picture_name;
    com_button.addEventListener('click', comment_event);
    com_button.appendChild(document.createTextNode('Send'));
    com_button.addEventListener('click', comment_event);
    subdiv.appendChild(com_button);
  }
}

function comment_event(e) {
  var picture_name = e.target.value;
  var comment = e.target.previousSibling.value;
  var post_data = "comment_event=yes&picture_name=" + picture_name +"&comment=" + comment;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        if (this.response != "") {
          var com = document.createElement('p');
          com.setAttribute('class', 'comment');
          com.style.backgroundColor = '#BED3E5';
          com.appendChild(document.createTextNode(user + " : " + this.response));
          e.target.parentElement.insertBefore(com, e.target.parentElement.firstChild);
          send_email_notification(e.target.parentElement.parentElement.firstChild.innerHTML);
        }
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}

function send_email_notification(user) {
  var post_data = "comment_notif=yes&user=" + user;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
        return ;
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}

function load_comments(picture_name, div) {
  var post_data = "comments=yes&picture_name=" + picture_name;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
          var comments = JSON.parse(this.response);
          create_comments_elem(comments, div, picture_name);
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}
