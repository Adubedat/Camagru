window.addEventListener("load", function(){
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
      canvas.getContext('2d').drawImage(uploaded_img, 0, 0, uploaded_img.naturalWidth, uploaded_img.naturalHeight, 0, 0, 640, 480);
    }
    else {
      canvas.width = 640;
      canvas.height = 480;
      canvas.getContext('2d').drawImage(video, 0, 0);
    }
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    photo.style.maxWidth = '320px';
    photo.style.maxHeight = '240px';
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
      if (document.getElementById(id + ' drag') != null) {
        document.getElementById(id + ' drag').remove();
      }
      else {
        var node = document.getElementById('drag-zone');
        new_img.setAttribute('src', src);
        new_img.setAttribute('class', 'draggable-images');
        new_img.setAttribute('id', id + ' drag');
        new_img.addEventListener('mousedown', initial_click);
        node.insertBefore(new_img, node.firstChild);
      }
    }
    else {
      alert('You have to enable your webcam or upload a picture to do that.');
    }
  }

  function initial_click(e) {
    if(moving){
      document.removeEventListener("mousemove", move);
      moving = !moving;
      return;
    }

    moving = !moving;
    image = this;
    var img_position = image.getBoundingClientRect();
    Xdiff = e.clientX - img_position.left;
    Ydiff = e.clientY - img_position.top;

    document.addEventListener("mousemove", move, false);
    document.Xdiff = Xdiff;
    document.Ydiff = Ydiff;
  }

  function move(e) {
    var newX = e.clientX - Xdiff;
    var newY = e.clientY - Ydiff;

    image.style.left = newX + 'px';
    image.style.top = newY + 'px';
  }
  function remove_draggable_images() {
    var images_list = document.getElementsByClassName('draggable-images');
    for (var i = 0; i < images_list.length; i++) {
      images_list[i].remove();
    }
  }
});
