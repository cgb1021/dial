<?php

$length = (int)$_GET['length'] or $length = 6;
sleep(2);

$giftName = array('50积分', '名牌安全套', '西班牙球衣', '30积分', '纪念钥匙扣', '纪念打火机');
//exit(json_encode(array('status'=>1, 'result'=>rand(0, $length-1))));
$result = rand(0, $length-1);
exit(json_encode(array('status'=>rand(0, 1), 'result'=>$result, 'gift'=>$giftName[$result])));