# dial
纯h5 转盘游戏
author: billchen(48838096@qq.com)
website: http://www.xhyo.com/
date: 2016.05.30

<pre>转动指针时，reverse设置为false（默认）。转动转盘时，reverse设置为true。
同步模式时，直接在start方法传入index参数，动画会在rounds圈后的index区域停止。
异步模式时，先调用start方法（别传index参数），需要停止时，调用stop方法并传入index参数，动画会在接下来的rounds圈后的index区域停止。
需要修改每圈的转动速度时，请在onroundend事件里，修改currentDuration属性的大小，单位是毫秒。
UI图默认是雪碧图，第一部分是转动区域，第二部分是静止内容（背景图）。</pre>

初始化参数说明

<pre>canvasId:"dial", //canvas id
duration: 500, //每一圈运行时长
rounds: 5, //运行圈数
length: 6, //奖品区间数量
degree: 0, //初始化角度
width: documentWidth*0.828, //canvas 宽度
height: documentWidth*0.828, //canvas 高度
image: "dial.png", //转盘UI背景图 雪碧图中，第一个位置是指针（要求是正方形），第二个位置是背景
reverse: false, //默认为false（转动指针的情况）。当转动对象是转盘时，请设置为true
onready: function() {}, //初始化完毕事件（图片加载完毕）
onroundend: function() {if(this.finishDegree > -1) {this.currentDuration = (1+.5)*this.currentDuration;}}, //每一圈执行完毕
onend: function() {} //整个动画执行完毕</pre>
			
对象属性

<pre>animationId:0 //定时器id
counter: 0 //已经完成的圈数
ctx: CanvasRenderingContext2D //canvas context
currentDuration: 0 //当前圈的执行时长
degree: 0 //当前角度
duration: 500 //初始化时每圈时长
event: Object //事件 onready,onend,onroundend
startDegree: 初始化角度
finishDegree:0 //结束角度（>-1才为有效结束角度）
height: 310.5 //canvas 高度
image: img //转盘UI图（image对象）
index: 0 //当前指针指向区间
length: 6 //区间个数（礼物个数）
rounds: 5 //转动圈数
state: 1 //运行状态 0:未初始化(UI图未加载完毕),1:正常状态(初始化完毕),2:运行中(转动中),3:准备停止(调用stop方法)
width:310.5 //canvas 宽度
reverse: false 是否反转角度</pre>

对象方法

<pre>start(index) //开始转动,index结束的区间（选）。不传参数，将开启无限模式
stop(index) //手动停止, index结束的区间（选）
reset() //重置</pre>
   
demo见index.html（转动指针）和index2.html（转动转盘）。使用问题请联系48838096@qq.com
