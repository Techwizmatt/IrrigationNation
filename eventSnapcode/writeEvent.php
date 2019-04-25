<?php
$myfile = fopen("../snapcodeID.txt", "w") or die("UUh oh... MANUAL WRITE NECESSARY");
$txt = $_GET['id'];
fwrite($myfile, $txt);
fclose($myfile);

echo($_GET['id']);
?>