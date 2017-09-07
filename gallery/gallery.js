load_gallery();

var user;
get_user();

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
  load_likes(picture.picture_location, div);
  load_comments(picture.picture_location, div);
  document.getElementById('gallery-grid').appendChild(div);
}

function create_likes_elem(likes, div, picture_name) {
  var likes_count = document.createElement('p');
  likes_count.setAttribute('class', 'left');
  likes_count.appendChild(document.createTextNode(likes.length + ' likes'));
  div.appendChild(likes_count);
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
        likes_button.style.backgroundColor = '#286da8';
      }
      else {
        likes_button.style.backgroundColor = 'white';
      }
    });
    div.appendChild(likes_button);
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
          e.target.style.backgroundColor = '#286da8';
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

function load_comments(picture_name, div) {
  var post_data = "comments=yes&picture_name=" + picture_name;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
          var comments = JSON.parse(this.response);
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}
