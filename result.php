<?php

$length = (int)$_GET['length'] or $length = 6;
sleep(2);
echo rand(0, $length-1);