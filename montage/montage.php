<?php

session_start();

include ('montage_db.php');
$data = file_get_contents('php://input');
$images = json_decode($data);
$dest_img = $images[0]->src;
$dest_img = img_to_resource($dest_img);
$final_image = create_montage($images, $dest_img);
echo $final_image;

function create_montage($images, $dest_img) {
  $i = 1;
  while($images[$i] != null) {
    $dest_img = collapse_images($dest_img, $images[$i]);
    $i += 1;
  }
  ob_start();
  imagepng($dest_img);
  $contents = ob_get_contents();
  ob_end_clean();
  date_default_timezone_set('Europe/Paris');
  $today = date('Y-m-d H:i:s');
  $img_location = $_SESSION['logged_on_user'] . $today;
  imagepng($dest_img, '../img/' . $img_location);
  img_to_db($img_location, $today);
  $dest_img = "data:image/png;base64," . base64_encode($contents);
  sleep(1);
  return ('../img/' . $img_location);
}

function collapse_images($dest, $img) {
  $array = split('/', $img->src);
  $src = imagecreatefrompng('../img/' . end($array));
  $srcWidth = imagesx($src);
  $srcHeight = imagesy($src);

  $destX = $img->distx;
  $destY = $img->disty;

  imagecopyresampled($dest, $src, $destX, $destY, 0, 0, $img->width, $img->height, $srcWidth, $srcHeight);

  return ($dest);
}

function img_to_resource($img) {
  $imginfo = getimagesize($img);
  $type = $imginfo['mime'];
  $allowed_types = array('image/png', 'image/jpg', 'image/gif', 'image/jpeg');
  if (!in_array($type, $allowed_types)) {
    echo "Wrong file type.";
    die;
  }
  if ($type == 'image/png') {
    return(imagecreatefrompng($img));
  }
  else if ($type == 'image/jpg' || $type == 'image/jpeg') {
    return(imagecreatefromjpeg($img));
  }
  else if ($type == 'image/gif') {
    return(imagecreatefromgif($img));
  }
}
