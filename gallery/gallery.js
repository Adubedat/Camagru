load_gallery();

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
  author.setAttribute('class', 'author');
  author.appendChild(document.createTextNode(picture.author));
  div.appendChild(author);
  var creation_date = document.createElement('p');
  creation_date.setAttribute('class', 'date');
  creation_date.appendChild(document.createTextNode(picture.creation_date));
  div.appendChild(creation_date);
  var img = document.createElement('img');
  img.setAttribute('src', '../img/' + picture.picture_location);
  img.setAttribute('class', 'gallery-img');
  div.appendChild(img);
  var likes = load_likes(picture.picture_location);
  var comments = load_comments(picture.picture_location);
  document.getElementById('gallery-grid').appendChild(div);
}

function load_likes(picture_name) {
  var post_data = "likes=yes&picture_name=" + picture_name;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
          var likes = JSON.parse(this.response);
          console.log(likes);
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}

function load_comments(picture_name) {
  var post_data = "comments=yes&picture_name=" + picture_name;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
      if (this.status == 200) {
          var comments = JSON.parse(this.response);
          console.log(comments);
      }
    }
  }
  xhttp.open("POST", "gallery/gallery.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post_data);
}
