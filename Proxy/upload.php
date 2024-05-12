<?php


$image = $_POST['image'];



$data = $image;

$data = "";

list($type, $data) = explode(';', $data);
list(, $data)      = explode(',', $data);
$data = base64_decode($data);

file_put_contents('uploads/image.png', $data);


?>