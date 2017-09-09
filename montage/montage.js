window.addEventListener("load", function(){
  load_author_pictures();

  var streaming = false;
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var photo = document.getElementById('photo');
  var take_snap = document.getElementById('take-snap');
  var moving = false;
  var localstream;

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  start_camera();
  function start_camera() {
    while (document.getElementsByClassName('draggable-images')[0] != null) {
      remove_draggable_images();
    }
    if (document.getElementById('uploaded_img') != null) {
      document.getElementById('uploaded_img').remove();
    }
    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        localstream = stream;
        video.style.display = 'block';
        document.getElementById('disable-camera').style.display = 'inline-block';
        document.getElementById('enable-camera').style.display = 'none';
        document.getElementById('upload-img').style.display = 'none';
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        alert("You have to allow access to your webcam in your browser's permissions to use your camera." )
        document.getElementById('enable-camera').style.display = 'inline-block';
        document.getElementById('upload-img').style.display = 'block';
        video.style.display = 'none';
        document.getElementById('disable-camera').style.display = 'none';
      }
    );
  }

  function takepicture() {
    if (document.getElementById('uploaded_img') != null) {
      var uploaded_img = document.getElementById('uploaded_img');
      var Xratio = 640 / uploaded_img.clientWidth;
      var Yratio = 480 / uploaded_img.clientHeight;
      canvas.getContext('2d').drawImage(uploaded_img, 0, 0, uploaded_img.naturalWidth, uploaded_img.naturalHeight, 0, 0, 640, 480);
    }
    else {
      var Xratio = 640 / video.clientWidth;
      var Yratio = 480 / video.clientHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
    }
    var img_url = canvas.toDataURL('image/png');
    var post_data = JSON.stringify(get_images_data(img_url, Xratio, Yratio));
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          image_callback(this);
        }
      }
    };
    xhttp.open("POST", "montage/montage.php", true);
    xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhttp.send(post_data);
  }

  function image_callback(response) {
    if (response.response != null && response.response != "")
      create_picture_elem(response.response);
  }

  function get_images_data(img_url, Xratio, Yratio) {
    var images = document.getElementsByClassName('draggable-images');
    var dragzone_position = document.getElementById('drag-zone').getBoundingClientRect();
    var array = [];
    array[0] = { src: img_url};
    var xratio = 640 / document.getElementById('uploaded_img')
    for (var i = 0; i < images.length; i++) {
      var img_position = images[i].getBoundingClientRect();
      array[i + 1] = { src: images[i].src,
                       distx: (img_position.left - dragzone_position.left) * Xratio,
                       disty: (img_position.top - dragzone_position.top) * Yratio,
                       width: images[i].clientWidth * Xratio,
                       height: images[i].clientHeight * Yratio};
    }
    return (array);
  }

  take_snap.addEventListener('click', function(ev){
      takepicture();
    ev.preventDefault();
  }, false);

  document.getElementById('disable-camera').addEventListener('click', stop_camera);
  document.getElementById('enable-camera').addEventListener('click', start_camera);

  function stop_camera() {
    while (document.getElementsByClassName('draggable-images')[0] != null) {
      remove_draggable_images();
      document.getElementById('take-snap').setAttribute('disabled', 'disabled');
    }
    var video = document.getElementById('video');
    video.pause();
    video.src = "";
    localstream.getVideoTracks()[0].stop();
    document.getElementById('enable-camera').style.display = 'inline-block';
    document.getElementById('upload-img').style.display = 'block';
    video.style.display = 'none';
    document.getElementById('disable-camera').style.display = 'none';
  }

  document.getElementById('upload-img').onclick = function() {
    document.getElementById('upload-input').click();
  }

  document.getElementById('upload-input').addEventListener('change', upload_image);

  function upload_image() {
    var allowedTypes = ['png', 'jpg', 'jpeg', 'gif'];
    var fileInput = document.getElementById('upload-input');
    var files = this.files;
    var imgType;

    imgType = files[0].name.split('.');
    imgType = imgType[imgType.length - 1];
    if (allowedTypes.indexOf(imgType) != -1) {
      display_uploaded_image(files[0]);
    }
    else {
      alert('Wrong file type.');
    }
  }

  function display_uploaded_image(file) {
    var reader = new FileReader();
    var node = document.getElementById('drag-zone');

    reader.addEventListener('load', function() {

      var img_element = document.createElement('img');
      img_element.setAttribute('id', 'uploaded_img');
      img_element.src = this.result;
      img_element.onload = function() {
      }
      node.insertBefore(img_element, node.firstChild);
      document.getElementById('upload-img').style.display = 'none';
      var width = img_element.clientWidth;
      img_element.style.height = width / (4/3);
    });

    reader.readAsDataURL(file);
  }

  var images_list = document.getElementsByClassName('list-images');
  for (var i = 0; i < images_list.length; i++) {
    images_list[i].addEventListener('click', image_to_drag_zone);
  }

  function image_to_drag_zone() {
    if (document.getElementById('uploaded_img') != null || document.getElementById('video').paused != true) {
      var src = this.getAttribute('src');
      var new_img = document.createElement('img');
      var id = this.getAttribute('id');
      var node = document.getElementById('drag-zone');
      new_img.setAttribute('src', src);
      new_img.setAttribute('class', 'draggable-images');
      new_img.setAttribute('id', id + ' drag');
      new_img.addEventListener('mousedown', initial_click);
      node.insertBefore(new_img, node.firstChild);
      document.getElementById('take-snap').removeAttribute('disabled');
    }
    else {
      alert('You have to enable your webcam or upload a picture to do that.');
    }
  }

  function initial_click(e) {
    if(moving){
      document.removeEventListener("mousemove", move);
      document.removeEventListener("keydown", modifImage);
      document.removeEventListener("click", initial_click);
      moving = !moving;
      return;
    }

    moving = !moving;
    image = this;
    var img_position = image.getBoundingClientRect();
    Xdiff = e.clientX - img_position.left;
    Ydiff = e.clientY - img_position.top;
    rightDiff = img_position.right - e.clientX;
    bottomDiff = img_position.bottom - e.clientY;

    document.addEventListener("mousemove", move, false);
    document.addEventListener("keydown", modifImage);
  }

  function modifImage(e) {
    if (e.keyCode == 46) {
      image.remove();
      if (document.getElementsByClassName('draggable-images')[0] == null) {
        document.getElementById('take-snap').setAttribute('disabled', 'disabled');
      }
    }
    else if (e.keyCode == 109) {
      image.style.width = image.clientWidth - 10;
      rightDiff -= 10;
      bottomDiff -= image.clientHeight / image.clientWidth * 10;
      if (image.clientWidth < Xdiff || image.clientHeight < Ydiff) {
        document.addEventListener("click", initial_click);
      }
    }
    else if (e.keyCode == 107) {
      var dragzone_position = document.getElementById('drag-zone').getBoundingClientRect();
      var img_position = image.getBoundingClientRect();
      if (img_position.right + 10 <= dragzone_position.right && img_position.bottom + (image.clientHeight / image.clientWidth * 10) <= dragzone_position.bottom) {
        image.style.width = image.clientWidth + 10;
        rightDiff += 10;
        bottomDiff += image.clientHeight / image.clientWidth * 10;
      }
    }
  }

  function move(e) {
    var newX = e.clientX - Xdiff;
    var newY = e.clientY - Ydiff;
    var newRight = e.clientX + rightDiff;
    var newBottom = e.clientY + bottomDiff;
    var dragzone_position = document.getElementById('drag-zone').getBoundingClientRect();

    if (newX >= dragzone_position.left && newY >= dragzone_position.top && newRight <= dragzone_position.right && newBottom <= dragzone_position.bottom) {
      image.style.left = newX + 'px';
      image.style.top = newY + window.scrollY + 'px';
    }
    else if ((newX <= dragzone_position.left || newRight >= dragzone_position.right) && newY >= dragzone_position.top && newBottom <= dragzone_position.bottom) {
      image.style.top = newY + window.scrollY + 'px';
    }
    else if ((newY <= dragzone_position.top || newBottom >= dragzone_position.bottom) && newX >= dragzone_position.left && newRight <= dragzone_position.right) {
      image.style.left = newX + 'px';
    }
  }

  function remove_draggable_images() {
    var images_list = document.getElementsByClassName('draggable-images');
    for (var i = 0; i < images_list.length; i++) {
      images_list[i].remove();
    }
  }

  function load_author_pictures() {
    var post_data = "author=yes";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          author_pictures_callback(this);
        }
      }
    };
    xhttp.open("POST", "montage/montage_db.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(post_data);
  }

  function author_pictures_callback(response) {
    var pictures_location = JSON.parse(response.response);
    for (var i = 0; i < pictures_location.length; i++) {
      create_picture_elem("../img/" + pictures_location[i]);
    }
  }

  function create_picture_elem(src) {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'user_picture_div');
    var newImg = document.createElement('img');
    newImg.src = src;
    var delete_button = document.createElement('img');
    delete_button.src = "../img/red-cross.png";
    delete_button.setAttribute('class', 'delete_button');
    delete_button.setAttribute('value', src);
    delete_button.addEventListener('click', delete_picture);
    newImg.setAttribute('class', 'user_picture');
    newDiv.appendChild(newImg);
    newDiv.appendChild(delete_button);
    var container = document.getElementById('user_pictures');
    container.insertBefore(newDiv, container.firstChild);
  }

  function delete_picture(e) {
    var post_data = "delete_image=" + e.target.getAttribute('value');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          e.target.parentElement.remove();
        }
      }
    };
    xhttp.open("POST", "montage/montage_db.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(post_data);
  }
});
