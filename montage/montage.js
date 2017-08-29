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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
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
});
