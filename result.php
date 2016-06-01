<?php

$length = (int)$_GET['length'] or $length = 6;
sleep(2);

//exit(json_encode(array('status'=>1, 'result'=>rand(0, $length-1))));
exit(json_encode(array('status'=>rand(0, 1), 'result'=>rand(0, $length-1))));