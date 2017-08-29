window.addEventListener("load", function(){
  var streaming = false;
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var photo = document.getElementById('photo');
  var take_snap = document.getElementById('take-snap');
  var localstream;

  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

  start_camera();
  function start_camera() {
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
    canvas.width = 640;
    canvas.height = 480;
    if (document.getElementById('uploaded_img') != null) {
      canvas.getContext('2d').drawImage(document.getElementById('uploaded_img'), 0, 0);
    }
    else {
      canvas.getContext('2d').drawImage(video, 0, 0);
    }
    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
    photo.style.width = '320px';
  }

  take_snap.addEventListener('click', function(ev){
      takepicture();
    ev.preventDefault();
  }, false);

  document.getElementById('disable-camera').addEventListener('click', stop_camera);
  document.getElementById('enable-camera').addEventListener('click', start_camera);

  function stop_camera() {
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
    var node = document.getElementById('montage');

    reader.addEventListener('load', function() {

      var img_element = document.createElement('img');
      img_element.setAttribute('id', 'uploaded_img');
      img_element.src = this.result;
      node.insertBefore(img_element, node.firstChild);
      document.getElementById('upload-img').style.display = 'none';

    });

    reader.readAsDataURL(file);
  }
});
