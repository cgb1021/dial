# dial
纯h5 转盘游戏

初始化参数说明

option {canvasId:"dial", //canvas id
 			duration: 500, //每一圈运行时长
 			round: 5, //运行圈数
 			length: 6, //奖品区间数量
 			degree: 0, //初始化角度
 			width: documentWidth*0.828, //canvas 宽度
 			height: documentWidth*0.828, //canvas 高度
 			image: "dial.png", //转盘UI背景图
 			onready: function() {}, //初始化完毕事件（图片加载完毕）
 			onroundend: function() {this.roundDuration = (1+.5)*this.roundDuration;}, //每一圈执行完毕
 			onend: function() {} //整个动画执行完毕
 			}
 
 对象属性说明
 
   ctx: CanvasRenderingContext2D //canvas context
   degree: 0 //初始化角度
   duration: 500 //初始化每圈时长
   event: Object //事件 onready,onend,onroundend
   height: 310.5 //canvas 高度
   image: img //转盘UI背景图
   index: 0 //当前指针指向区间
   length: 6 //区间个数（礼物个数）
   round: 5 //转动圈数
   roundDuration: 0 //每圈执行时长
   state: 1 //状态，0,未初始化;1,初始化完毕;2,执行中
   width:310.5 //canvas 宽度

 对象方法说明
 
   start(index) //开始转动,index结束的区间
   stop() //手动停止
   reset() //重置
   
   使用问题请联系48838096@qq.com
